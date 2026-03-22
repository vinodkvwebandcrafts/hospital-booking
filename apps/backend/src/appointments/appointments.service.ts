import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AppointmentEntity,
  AppointmentStatus,
} from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { SlotLockingService } from './slot-locking/slot-locking.service';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentsRepository: Repository<AppointmentEntity>,
    private readonly slotLockingService: SlotLockingService,
    private readonly doctorsService: DoctorsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createDto: CreateAppointmentDto,
    userId: string,
  ): Promise<AppointmentEntity> {
    const doctor = await this.doctorsService.findById(createDto.doctorId);

    if (!doctor.isAvailable) {
      throw new BadRequestException('Doctor is not currently available');
    }

    const dateTimeKey = new Date(createDto.appointmentDateTime).toISOString();

    const lockAcquired = await this.slotLockingService.acquireSlotLock(
      createDto.doctorId,
      dateTimeKey,
      userId,
    );

    if (!lockAcquired) {
      throw new ConflictException(
        'This time slot is currently being booked by another user. Please try again.',
      );
    }

    try {
      const existingAppointment = await this.appointmentsRepository.findOne({
        where: {
          doctorId: createDto.doctorId,
          appointmentDateTime: new Date(createDto.appointmentDateTime),
          status: Not(In([AppointmentStatus.CANCELLED])),
        },
      });

      if (existingAppointment) {
        throw new ConflictException(
          'This time slot is already booked. Please choose a different time.',
        );
      }

      const appointment = this.appointmentsRepository.create({
        doctorId: createDto.doctorId,
        patientId: userId,
        appointmentDateTime: new Date(createDto.appointmentDateTime),
        durationMinutes:
          createDto.durationMinutes || doctor.appointmentDurationMinutes,
        reason: createDto.reason,
        consultationType: createDto.consultationType,
        consultationFee: doctor.consultationFee,
        status: AppointmentStatus.SCHEDULED,
      });

      const saved = await this.appointmentsRepository.save(appointment);

      const fullAppointment = await this.findById(saved.id);

      this.eventEmitter.emit('appointment.created', {
        appointment: fullAppointment,
      });

      return fullAppointment;
    } catch (error) {
      await this.slotLockingService.releaseSlotLock(
        createDto.doctorId,
        dateTimeKey,
        userId,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<AppointmentEntity> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor', 'doctor.user', 'patient'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return appointment;
  }

  async cancel(id: string, userId: string): Promise<AppointmentEntity> {
    const appointment = await this.findById(id);

    if (
      appointment.patientId !== userId &&
      appointment.doctor.userId !== userId
    ) {
      throw new ForbiddenException(
        'You can only cancel your own appointments',
      );
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();

    const saved = await this.appointmentsRepository.save(appointment);

    this.eventEmitter.emit('appointment.cancelled', { appointment: saved });

    return saved;
  }

  async reschedule(
    id: string,
    createDto: CreateAppointmentDto,
    userId: string,
  ): Promise<AppointmentEntity> {
    await this.cancel(id, userId);
    return this.create(createDto, userId);
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<AppointmentEntity> {
    const appointment = await this.findById(id);
    appointment.status = status;

    if (status === AppointmentStatus.CANCELLED) {
      appointment.cancelledAt = new Date();
    }

    const saved = await this.appointmentsRepository.save(appointment);

    this.eventEmitter.emit(`appointment.${status.toLowerCase()}`, {
      appointment: saved,
    });

    return saved;
  }

  async getAvailableSlots(
    doctorId: string,
    date: string,
  ): Promise<
    { startTime: string; endTime: string; isAvailable: boolean; isLocked: boolean }[]
  > {
    const allSlots = await this.doctorsService.getAvailableSlots(
      doctorId,
      date,
    );

    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59.999`);

    const bookedAppointments = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.doctorId = :doctorId', { doctorId })
      .andWhere(
        'appointment.appointmentDateTime BETWEEN :start AND :end',
        { start: startOfDay, end: endOfDay },
      )
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

    const result = await Promise.all(
      allSlots.map(async (slot) => {
        const isBooked = bookedTimes.has(slot.startTime);
        const dateTimeKey = new Date(`${date}T${slot.startTime}:00`).toISOString();
        const isLocked = await this.slotLockingService.isSlotLocked(
          doctorId,
          dateTimeKey,
        );

        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: !isBooked && !isLocked,
          isLocked,
        };
      }),
    );

    return result;
  }

  async findByPatient(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ appointments: AppointmentEntity[]; total: number }> {
    const [appointments, total] = await this.appointmentsRepository.findAndCount(
      {
        where: { patientId: userId },
        relations: ['doctor', 'doctor.user', 'patient'],
        order: { appointmentDateTime: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return { appointments, total };
  }

  async findByDoctor(
    doctorId: string,
    page = 1,
    limit = 10,
  ): Promise<{ appointments: AppointmentEntity[]; total: number }> {
    const [appointments, total] = await this.appointmentsRepository.findAndCount(
      {
        where: { doctorId },
        relations: ['doctor', 'doctor.user', 'patient'],
        order: { appointmentDateTime: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return { appointments, total };
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: { status?: AppointmentStatus; doctorId?: string; patientId?: string },
  ): Promise<{ appointments: AppointmentEntity[]; total: number }> {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.doctorId) where.doctorId = filters.doctorId;
    if (filters?.patientId) where.patientId = filters.patientId;

    const [appointments, total] = await this.appointmentsRepository.findAndCount(
      {
        where,
        relations: ['doctor', 'doctor.user', 'patient'],
        order: { appointmentDateTime: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return { appointments, total };
  }
}
