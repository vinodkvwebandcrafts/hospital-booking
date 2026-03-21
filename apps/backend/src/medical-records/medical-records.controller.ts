import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('Medical Records')
@ApiBearerAuth()
@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService: MedicalRecordsService,
  ) {}

  @Post()
  @Roles('DOCTOR')
  @ApiOperation({ summary: 'Create a medical record (doctor only)' })
  async create(
    @Body() createDto: CreateMedicalRecordDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.medicalRecordsService.create(createDto, user.id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get medical records for a patient' })
  async findByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.medicalRecordsService.findByPatient(
      patientId,
      user.id,
      user.role,
    );
  }

  @Get('appointment/:appointmentId')
  @ApiOperation({ summary: 'Get medical record for an appointment' })
  async findByAppointment(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return this.medicalRecordsService.findByAppointment(appointmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical record by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalRecordsService.findById(id);
  }

  @Patch(':id')
  @Roles('DOCTOR')
  @ApiOperation({ summary: 'Update a medical record (doctor only)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMedicalRecordDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.medicalRecordsService.update(id, updateDto, user.id);
  }
}
