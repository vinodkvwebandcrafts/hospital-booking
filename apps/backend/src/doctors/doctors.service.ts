import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { DoctorEntity } from './entities/doctor.entity';
import { AvailabilityEntity } from './entities/availability.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { AppointmentEntity, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { SlotLockingService } from '../appointments/slot-locking/slot-locking.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorsRepository: Repository<DoctorEntity>,
    @InjectRepository(AvailabilityEntity)
    private readonly availabilityRepository: Repository<AvailabilityEntity>,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentsRepository: Repository<AppointmentEntity>,
    private readonly slotLockingService: SlotLockingService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorEntity> {
    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async findAll(): Promise<DoctorEntity[]> {
    return this.doctorsRepository.find({
      relations: ['user', 'availabilities'],
    });
  }

  async findWithFilters(filters: {
    specialization?: string;
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ doctors: DoctorEntity[]; total: number }> {
    const { specialization, city, search, page = 1, limit = 10 } = filters;

    const qb = this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.availabilities', 'availabilities')
      .where('doctor.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('user.isActive = :isActive', { isActive: true });

    if (specialization) {
      qb.andWhere('LOWER(doctor.specialization) = LOWER(:specialization)', {
        specialization,
      });
    }

    if (city) {
      qb.andWhere('LOWER(user.city) = LOWER(:city)', { city });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(doctor.specialization) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('doctor.averageRating', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [doctors, total] = await qb.getManyAndCount();

    return { doctors, total };
  }

  async findById(id: string): Promise<DoctorEntity> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: ['user', 'availabilities'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    return doctor;
  }

  async findByUserId(userId: string): Promise<DoctorEntity | null> {
    return this.doctorsRepository.findOne({
      where: { userId },
      relations: ['user', 'availabilities'],
    });
  }

  async update(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<DoctorEntity> {
    const doctor = await this.findById(id);
    Object.assign(doctor, updateDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async setAvailability(
    doctorId: string,
    setAvailabilityDto: SetAvailabilityDto,
  ): Promise<AvailabilityEntity[]> {
    await this.findById(doctorId);

    await this.availabilityRepository.delete({ doctorId });

    const availabilities = setAvailabilityDto.availabilities.map((slot) =>
      this.availabilityRepository.create({
        ...slot,
        doctorId,
      }),
    );

    return this.availabilityRepository.save(availabilities);
  }

  async getAvailableSlots(
    doctorId: string,
    date: string,
  ): Promise<{ startTime: string; endTime: string; isAvailable: boolean; isLocked: boolean }[]> {
    const doctor = await this.findById(doctorId);

    // Parse date parts directly to avoid timezone-shifted day-of-week
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const jsDay = localDate.getDay();
    // Our system: 0=Monday … 6=Sunday
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

    const availabilities = await this.availabilityRepository.find({
      where: { doctorId, dayOfWeek, isActive: true },
    });

    const rawSlots: { startTime: string; endTime: string }[] = [];
    const duration = doctor.appointmentDurationMinutes;

    for (const availability of availabilities) {
      const [startH, startM] = availability.startTime.split(':').map(Number);
      const [endH, endM] = availability.endTime.split(':').map(Number);

      let currentMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      while (currentMinutes + duration <= endMinutes) {
        const slotStartH = Math.floor(currentMinutes / 60);
        const slotStartM = currentMinutes % 60;
        const slotEndMinutes = currentMinutes + duration;
        const slotEndH = Math.floor(slotEndMinutes / 60);
        const slotEndM = slotEndMinutes % 60;

        rawSlots.push({
          startTime: `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`,
          endTime: `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`,
        });

        currentMinutes += duration;
      }
    }

    // Build date range using local midnight boundaries to match stored naive times
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59.999`);

    const bookedAppointments = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.doctorId = :doctorId', { doctorId })
      .andWhere('appointment.appointmentDateTime BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [AppointmentStatus.CANCELLED],
      })
      .getMany();

    const bookedTimes = new Set(
      bookedAppointments.map((apt) => {
        const d = new Date(apt.appointmentDateTime);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }),
    );

    return Promise.all(
      rawSlots.map(async (slot) => {
        const isBooked = bookedTimes.has(slot.startTime);
        const dateTimeKey = new Date(`${date}T${slot.startTime}:00`).toISOString();
        const isLocked = await this.slotLockingService.isSlotLocked(doctorId, dateTimeKey);

        return {
          ...slot,
          isAvailable: !isBooked && !isLocked,
          isLocked,
        };
      }),
    );
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.findById(id);
    doctor.isAvailable = false;
    await this.doctorsRepository.save(doctor);
  }
}
