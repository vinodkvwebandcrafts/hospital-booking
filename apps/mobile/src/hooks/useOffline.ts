import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Lightweight online/offline detection.
 *
 * Uses a periodic fetch to a known endpoint.  For a production app you would
 * use `@react-native-community/netinfo`, but this avoids the extra native
 * dependency for now.
 */
export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const check = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5_000);
        await fetch('https://clients3.google.com/generate_204', {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    const handleAppState = (state: AppStateStatus) => {
      if (state === 'active') {
        check();
      }
    };

    check();
    interval = setInterval(check, 30_000);

    const sub = AppState.addEventListener('change', handleAppState);

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, []);

  return { isOnline };
}
