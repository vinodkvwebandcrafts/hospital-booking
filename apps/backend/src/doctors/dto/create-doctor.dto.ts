import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiPropertyOptional({ example: 'LIC-12345' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 'Experienced cardiologist...' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  @Min(10)
  appointmentDurationMinutes?: number;

  @ApiPropertyOptional({ example: 150.0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional({ example: 'Heart Care Clinic' })
  @IsString()
  @IsOptional()
  clinicName?: string;

  @ApiPropertyOptional({ example: '456 Medical Ave' })
  @IsString()
  @IsOptional()
  clinicAddress?: string;
}
