import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrescriptionDto {
  @ApiProperty({ example: 'Amoxicillin' })
  @IsString()
  @IsNotEmpty()
  medication!: string;

  @ApiProperty({ example: '500mg' })
  @IsString()
  @IsNotEmpty()
  dosage!: string;

  @ApiProperty({ example: '3 times daily' })
  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @ApiProperty({ example: '7 days' })
  @IsString()
  @IsNotEmpty()
  duration!: string;

  @ApiPropertyOptional({ example: 'Take after meals' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  appointmentId!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({ example: 'Headache, fever, cough' })
  @IsString()
  @IsNotEmpty()
  symptoms!: string;

  @ApiProperty({ example: 'Upper respiratory infection' })
  @IsString()
  @IsNotEmpty()
  diagnosis!: string;

  @ApiPropertyOptional({ example: 'Rest, fluids, antibiotics' })
  @IsString()
  @IsOptional()
  treatmentPlan?: string;

  @ApiPropertyOptional({ type: [PrescriptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionDto)
  @IsOptional()
  prescriptions?: PrescriptionDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  labResults?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isConfidential?: boolean;
}
