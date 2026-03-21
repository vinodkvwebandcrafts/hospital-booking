import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import apiClient from '@/services/api/client';

/**
 * Request push-notification permissions and return the Expo push token.
 * Returns `null` when running on a simulator or when the user denies access.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device.');
    return null;
  }

  // Android needs a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563eb',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
    projectId: projectId as string,
  });

  return pushToken;
}

/**
 * Send the push token to the backend so the server can deliver
 * notifications to this device.
 */
export async function savePushTokenToBackend(pushToken: string): Promise<void> {
  try {
    await apiClient.post('/notifications/register-device', {
      pushToken,
      deviceType: Platform.OS as 'ios' | 'android',
    });
  } catch (error) {
    console.error('Failed to register push token with backend:', error);
  }
}
