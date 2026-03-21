import axios from 'axios';
import { API_URL } from '@/config/constants';
import { getAccessToken } from '@/services/storage/secureStorage';

/**
 * Pre-configured Axios instance.
 * - Automatically attaches the Bearer token from secure storage.
 * - Sets JSON content-type headers.
 */
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor ────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ───────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // You could implement silent token refresh here using the refresh token.
    return Promise.reject(error);
  },
);

export default apiClient;
