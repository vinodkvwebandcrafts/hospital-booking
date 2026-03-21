import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: '2026-03-25T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  appointmentDateTime?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}
