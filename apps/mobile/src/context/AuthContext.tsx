import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User, LoginDto, AuthResponse } from '@/types';
import * as authApi from '@/services/api/auth';
import {
  saveAccessToken,
  saveRefreshToken,
  saveUserData,
  getAccessToken,
  getUserData,
  clearAuthData,
} from '@/services/storage/secureStorage';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate session from secure storage on mount
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const raw = await getUserData();
          if (raw) {
            setUser(JSON.parse(raw) as User);
          }
        }
      } catch {
        // token missing or corrupted -- stay logged out
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const result: AuthResponse = await authApi.login(dto);
    await saveAccessToken(result.accessToken);
    await saveRefreshToken(result.refreshToken);
    await saveUserData(JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    await clearAuthData();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
