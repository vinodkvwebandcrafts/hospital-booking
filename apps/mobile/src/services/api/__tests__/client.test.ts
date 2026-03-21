import axios from 'axios';
import * as secureStorage from '@/services/storage/secureStorage';

// Mock secureStorage before importing the client
jest.mock('@/services/storage/secureStorage');

// We need to test the interceptor behavior, so we'll import the client
// after setting up mocks
const mockGetAccessToken = secureStorage.getAccessToken as jest.MockedFunction<
  typeof secureStorage.getAccessToken
>;

describe('apiClient', () => {
  let apiClient: typeof import('../client').default;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Re-import to get a fresh instance with interceptors
    jest.resetModules();
    jest.mock('@/services/storage/secureStorage');
    const mod = await import('../client');
    apiClient = mod.default;
  });

  it('should be an axios instance', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults).toBeDefined();
  });

  it('should have JSON content-type headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    expect(apiClient.defaults.headers['Accept']).toBe('application/json');
  });

  it('should have a 15-second timeout', () => {
    expect(apiClient.defaults.timeout).toBe(15_000);
  });

  it('should attach Bearer token when token exists', async () => {
    // The interceptor calls getAccessToken from secureStorage
    const { getAccessToken: mockGet } = require('@/services/storage/secureStorage');
    (mockGet as jest.Mock).mockResolvedValue('test-jwt-token');

    // Use the request interceptor directly
    const interceptors = (apiClient.interceptors.request as any).handlers;
    expect(interceptors.length).toBeGreaterThan(0);

    const fulfilled = interceptors[0].fulfilled;
    const config = { headers: {} as any };
    const result = await fulfilled(config);

    expect(result.headers.Authorization).toBe('Bearer test-jwt-token');
  });

  it('should not attach Authorization header when no token exists', async () => {
    const { getAccessToken: mockGet } = require('@/services/storage/secureStorage');
    (mockGet as jest.Mock).mockResolvedValue(null);

    const interceptors = (apiClient.interceptors.request as any).handlers;
    const fulfilled = interceptors[0].fulfilled;
    const config = { headers: {} as any };
    const result = await fulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should reject when the request interceptor errors', async () => {
    const interceptors = (apiClient.interceptors.request as any).handlers;
    const rejected = interceptors[0].rejected;
    const error = new Error('Request setup failed');

    await expect(rejected(error)).rejects.toThrow('Request setup failed');
  });
});
