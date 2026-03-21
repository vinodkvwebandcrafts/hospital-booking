import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  getToken: () => string | null | Promise<string | null>;
  onUnauthorized?: () => void;
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  client.interceptors.request.use(async (reqConfig: InternalAxiosRequestConfig) => {
    const token = await config.getToken();
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && config.onUnauthorized) {
        config.onUnauthorized();
      }
      return Promise.reject(error);
    },
  );

  return client;
}
