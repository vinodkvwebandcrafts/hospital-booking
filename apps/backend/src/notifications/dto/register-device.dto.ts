import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'ExponentPushToken[xxxxxx]' })
  @IsString()
  @IsNotEmpty()
  pushToken: string;

  @ApiProperty({ enum: ['ios', 'android'] })
  @IsString()
  @IsIn(['ios', 'android'])
  deviceType: 'ios' | 'android';
}
