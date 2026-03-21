import { IsOptional, IsString, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: 'Cardiology' })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiPropertyOptional({ example: 'LIC-12345' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional()
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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  clinicName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  clinicAddress?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
