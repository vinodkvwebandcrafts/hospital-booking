import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/config/constants';

/** Save the access token to secure storage. */
export async function saveAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
}

/** Retrieve the access token from secure storage. */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
}

/** Save the refresh token to secure storage. */
export async function saveRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
}

/** Retrieve the refresh token from secure storage. */
export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
}

/** Save serialised user data. */
export async function saveUserData(data: string): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEYS.USER, data);
}

/** Retrieve serialised user data. */
export async function getUserData(): Promise<string | null> {
  return SecureStore.getItemAsync(STORAGE_KEYS.USER);
}

/** Remove all auth-related data from secure storage. */
export async function clearAuthData(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
}
