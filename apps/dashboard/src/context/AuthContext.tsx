import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { User, UserRole, AuthResponse } from '@hospital-booking/shared-types';
import { hasPermission as checkPermission, hasRole as checkRole, type Permission } from '@/lib/rbac';
import { authApi } from '@/services/api/authApi';
import { apiClient } from '@/services/api/client';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'dashboard_access_token';
const REFRESH_KEY = 'dashboard_refresh_token';
const USER_KEY = 'dashboard_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authApi.login({ email, password });
      const { accessToken, refreshToken, user: loggedInUser } = response;

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));

      setToken(accessToken);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => (user ? checkRole(user.role, role) : false),
    [user],
  );

  const hasPermission = useCallback(
    (permission: Permission) => (user ? checkPermission(user.role, permission) : false),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
      hasRole,
      hasPermission,
    }),
    [user, token, isLoading, login, logout, hasRole, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
