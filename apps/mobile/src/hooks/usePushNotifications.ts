import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  savePushTokenToBackend,
} from '@/services/notifications/tokenManager';
import {
  configureNotificationHandler,
  handleNotificationResponse,
} from '@/services/notifications/notificationHandler';

/**
 * Hook that registers for push notifications, saves the token to the
 * backend, and sets up foreground / response listeners.
 */
export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    configureNotificationHandler();

    // Register and persist the push token
    registerForPushNotifications().then((token) => {
      if (token) {
        setExpoPushToken(token);
        savePushTokenToBackend(token);
      }
    });

    // Foreground notification received
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (_notification) => {
        // You can show an in-app toast here if needed
      },
    );

    // User tapped a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return { expoPushToken };
}
