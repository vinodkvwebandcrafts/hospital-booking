import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PushNotificationService } from './push/push-notification.service';
import { EmailService } from './email/email.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PushNotificationService, EmailService],
  exports: [NotificationsService, PushNotificationService, EmailService],
})
export class NotificationsModule {}
