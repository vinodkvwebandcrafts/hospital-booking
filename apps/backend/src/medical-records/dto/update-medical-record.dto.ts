import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionDto } from './create-medical-record.dto';

export class UpdateMedicalRecordDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  symptoms?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional()
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

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isConfidential?: boolean;
}
