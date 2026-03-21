import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

/**
 * Configure the global notification handler so that notifications received
 * while the app is in the foreground are shown to the user.
 */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * When the user taps a notification, navigate to the relevant screen.
 */
export function handleNotificationResponse(
  response: Notifications.NotificationResponse,
): void {
  const data = response.notification.request.content.data as
    | Record<string, string>
    | undefined;

  if (!data) return;

  if (data.appointmentId) {
    router.push(`/(authenticated)/(doctor-tabs)/appointments/${data.appointmentId}` as never);
  }
}
