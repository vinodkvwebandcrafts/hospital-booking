import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register-device')
  @ApiOperation({ summary: 'Register device for push notifications' })
  async registerDevice(
    @Body() registerDeviceDto: RegisterDeviceDto,
    @CurrentUser() user: UserEntity,
  ) {
    await this.usersService.updatePushToken(
      user.id,
      registerDeviceDto.pushToken,
    );
    return { message: 'Device registered successfully' };
  }
}
