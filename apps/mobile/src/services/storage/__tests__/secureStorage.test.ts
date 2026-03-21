import * as SecureStore from 'expo-secure-store';
import {
  saveAccessToken,
  getAccessToken,
  saveRefreshToken,
  getRefreshToken,
  saveUserData,
  getUserData,
  clearAuthData,
} from '../secureStorage';
import { STORAGE_KEYS } from '@/config/constants';

jest.mock('expo-secure-store');

const mockSetItem = SecureStore.setItemAsync as jest.MockedFunction<
  typeof SecureStore.setItemAsync
>;
const mockGetItem = SecureStore.getItemAsync as jest.MockedFunction<
  typeof SecureStore.getItemAsync
>;
const mockDeleteItem = SecureStore.deleteItemAsync as jest.MockedFunction<
  typeof SecureStore.deleteItemAsync
>;

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Access Token ─────────────────────────────────────────────────

  describe('saveAccessToken', () => {
    it('should store the access token with the correct key', async () => {
      await saveAccessToken('my-access-token');
      expect(mockSetItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ACCESS_TOKEN,
        'my-access-token',
      );
    });
  });

  describe('getAccessToken', () => {
    it('should retrieve the access token', async () => {
      mockGetItem.mockResolvedValue('stored-token');
      const token = await getAccessToken();
      expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(token).toBe('stored-token');
    });

    it('should return null when no token is stored', async () => {
      mockGetItem.mockResolvedValue(null);
      const token = await getAccessToken();
      expect(token).toBeNull();
    });
  });

  // ── Refresh Token ────────────────────────────────────────────────

  describe('saveRefreshToken', () => {
    it('should store the refresh token with the correct key', async () => {
      await saveRefreshToken('my-refresh-token');
      expect(mockSetItem).toHaveBeenCalledWith(
        STORAGE_KEYS.REFRESH_TOKEN,
        'my-refresh-token',
      );
    });
  });

  describe('getRefreshToken', () => {
    it('should retrieve the refresh token', async () => {
      mockGetItem.mockResolvedValue('stored-refresh');
      const token = await getRefreshToken();
      expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(token).toBe('stored-refresh');
    });

    it('should return null when no refresh token is stored', async () => {
      mockGetItem.mockResolvedValue(null);
      const token = await getRefreshToken();
      expect(token).toBeNull();
    });
  });

  // ── User Data ────────────────────────────────────────────────────

  describe('saveUserData', () => {
    it('should store serialised user data', async () => {
      const data = JSON.stringify({ id: '1', name: 'Test' });
      await saveUserData(data);
      expect(mockSetItem).toHaveBeenCalledWith(STORAGE_KEYS.USER, data);
    });
  });

  describe('getUserData', () => {
    it('should retrieve user data', async () => {
      const data = JSON.stringify({ id: '1', name: 'Test' });
      mockGetItem.mockResolvedValue(data);
      const result = await getUserData();
      expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
      expect(result).toBe(data);
    });

    it('should return null when no user data is stored', async () => {
      mockGetItem.mockResolvedValue(null);
      const result = await getUserData();
      expect(result).toBeNull();
    });
  });

  // ── Clear Auth Data ──────────────────────────────────────────────

  describe('clearAuthData', () => {
    it('should delete all three auth-related keys', async () => {
      await clearAuthData();
      expect(mockDeleteItem).toHaveBeenCalledTimes(3);
      expect(mockDeleteItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockDeleteItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(mockDeleteItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    });
  });
});
