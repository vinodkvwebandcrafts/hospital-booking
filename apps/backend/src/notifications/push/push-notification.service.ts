import { Injectable, Logger } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class PushNotificationService {
  private readonly expo: Expo;
  private readonly logger = new Logger(PushNotificationService.name);

  constructor() {
    this.expo = new Expo();
  }

  async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!Expo.isExpoPushToken(pushToken)) {
      this.logger.warn(`Invalid Expo push token: ${pushToken}`);
      return;
    }

    const message: ExpoPushMessage = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    };

    try {
      const chunks = this.expo.chunkPushNotifications([message]);

      for (const chunk of chunks) {
        const ticketChunk: ExpoPushTicket[] =
          await this.expo.sendPushNotificationsAsync(chunk);

        for (const ticket of ticketChunk) {
          if (ticket.status === 'error') {
            this.logger.error(
              `Push notification error: ${ticket.message}`,
            );
            if (ticket.details && ticket.details.error) {
              this.logger.error(`Error details: ${ticket.details.error}`);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
    }
  }

  async sendBulkPushNotifications(
    notifications: {
      pushToken: string;
      title: string;
      body: string;
      data?: Record<string, string>;
    }[],
  ): Promise<void> {
    const messages: ExpoPushMessage[] = notifications
      .filter((n) => Expo.isExpoPushToken(n.pushToken))
      .map((n) => ({
        to: n.pushToken,
        sound: 'default' as const,
        title: n.title,
        body: n.body,
        data: n.data || {},
      }));

    if (messages.length === 0) {
      return;
    }

    try {
      const chunks = this.expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        await this.expo.sendPushNotificationsAsync(chunk);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send bulk push notifications: ${error.message}`,
      );
    }
  }
}
