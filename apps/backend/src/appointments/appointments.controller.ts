import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { AppointmentStatus } from './entities/appointment.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  async create(
    @Body() createDto: CreateAppointmentDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.appointmentsService.create(createDto, user.id);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all appointments (admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  @ApiQuery({ name: 'doctorId', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: AppointmentStatus,
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
  ) {
    const { appointments, total } = await this.appointmentsService.findAll(
      page,
      limit,
      { status, doctorId, patientId },
    );

    return {
      data: appointments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user appointments (patient)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getMyAppointments(
    @CurrentUser() user: UserEntity,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { appointments, total } =
      await this.appointmentsService.findByPatient(user.id, page, limit);

    return {
      data: appointments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  @Get('doctor/:doctorId')
  @Roles('ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Get appointments for a doctor' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getByDoctor(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { appointments, total } =
      await this.appointmentsService.findByDoctor(doctorId, page, limit);

    return {
      data: appointments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  @Get('slots/:doctorId')
  @Public()
  @ApiOperation({ summary: 'Get available slots for a doctor on a date' })
  @ApiQuery({ name: 'date', required: true, example: '2026-03-25' })
  async getAvailableSlots(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(doctorId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findById(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.appointmentsService.cancel(id, user.id);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  async reschedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createDto: CreateAppointmentDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.appointmentsService.reschedule(id, createDto, user.id);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'DOCTOR')
  @ApiOperation({ summary: 'Update appointment status (doctor/admin)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateStatus(id, updateDto.status);
  }
}
