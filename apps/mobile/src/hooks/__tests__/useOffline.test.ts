import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AppState } from 'react-native';

// Store the event listener callback so we can trigger it in tests
let appStateCallback: ((state: string) => void) | null = null;
const mockRemove = jest.fn();

jest.spyOn(AppState, 'addEventListener').mockImplementation(
  (_type: string, listener: any) => {
    appStateCallback = listener;
    return { remove: mockRemove } as any;
  },
);

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock AbortController
const mockAbort = jest.fn();
global.AbortController = jest.fn(() => ({
  signal: 'mock-signal',
  abort: mockAbort,
})) as any;

// Import after mocks are set up
import { useOffline } from '../useOffline';

describe('useOffline', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({});
    appStateCallback = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should default to online', () => {
    const { result } = renderHook(() => useOffline());
    expect(result.current.isOnline).toBe(true);
  });

  it('should be online when fetch succeeds', async () => {
    mockFetch.mockResolvedValue({});
    const { result } = renderHook(() => useOffline());

    await waitFor(() => {
      expect(result.current.isOnline).toBe(true);
    });
  });

  it('should be offline when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useOffline());

    await waitFor(() => {
      expect(result.current.isOnline).toBe(false);
    });
  });

  it('should check connectivity on an interval', async () => {
    mockFetch.mockResolvedValue({});
    renderHook(() => useOffline());

    // Initial call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Advance 30 seconds for the interval
    act(() => {
      jest.advanceTimersByTime(30_000);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should check connectivity when app becomes active', async () => {
    mockFetch.mockResolvedValue({});
    renderHook(() => useOffline());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Simulate app coming to foreground
    act(() => {
      appStateCallback?.('active');
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should not check connectivity when app goes to background', async () => {
    mockFetch.mockResolvedValue({});
    renderHook(() => useOffline());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    act(() => {
      appStateCallback?.('background');
    });

    // Should still be 1 -- no extra call for background
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should clean up interval and listener on unmount', async () => {
    mockFetch.mockResolvedValue({});
    const { unmount } = renderHook(() => useOffline());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });
});
