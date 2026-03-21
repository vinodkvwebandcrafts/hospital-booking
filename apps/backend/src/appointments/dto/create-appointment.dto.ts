import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsultationType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: '2026-03-25T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDateTime: string;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  @Min(10)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 'Regular checkup' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ enum: ConsultationType })
  @IsEnum(ConsultationType)
  @IsOptional()
  consultationType?: ConsultationType;
}
