import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { AuthProvider, useAuthContext } from '../AuthContext';
import * as secureStorage from '@/services/storage/secureStorage';
import * as authApi from '@/services/api/auth';
import type { User, AuthResponse } from '@/types';
import { UserRole } from '@/types';

jest.mock('@/services/storage/secureStorage');
jest.mock('@/services/api/auth');

const mockGetAccessToken = secureStorage.getAccessToken as jest.MockedFunction<
  typeof secureStorage.getAccessToken
>;
const mockGetUserData = secureStorage.getUserData as jest.MockedFunction<
  typeof secureStorage.getUserData
>;
const mockSaveAccessToken = secureStorage.saveAccessToken as jest.MockedFunction<
  typeof secureStorage.saveAccessToken
>;
const mockSaveRefreshToken = secureStorage.saveRefreshToken as jest.MockedFunction<
  typeof secureStorage.saveRefreshToken
>;
const mockSaveUserData = secureStorage.saveUserData as jest.MockedFunction<
  typeof secureStorage.saveUserData
>;
const mockClearAuthData = secureStorage.clearAuthData as jest.MockedFunction<
  typeof secureStorage.clearAuthData
>;
const mockLoginApi = authApi.login as jest.MockedFunction<typeof authApi.login>;

const testUser: User = {
  id: 'user-1',
  email: 'doc@test.com',
  firstName: 'Test',
  lastName: 'Doctor',
  phone: '555-0000',
  role: UserRole.DOCTOR,
  isActive: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const testAuthResponse: AuthResponse = {
  accessToken: 'access-123',
  refreshToken: 'refresh-456',
  user: testUser,
};

// Test component that consumes the auth context
function TestConsumer() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthContext();

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <>
      <Text testID="auth-status">
        {isAuthenticated ? `Logged in as ${user?.firstName}` : 'Not logged in'}
      </Text>
      <Pressable
        testID="login-btn"
        onPress={() => login({ email: 'doc@test.com', password: 'pass123' })}
      />
      <Pressable testID="logout-btn" onPress={logout} />
    </>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAccessToken.mockResolvedValue(null);
    mockGetUserData.mockResolvedValue(null);
    mockSaveAccessToken.mockResolvedValue(undefined);
    mockSaveRefreshToken.mockResolvedValue(undefined);
    mockSaveUserData.mockResolvedValue(undefined);
    mockClearAuthData.mockResolvedValue(undefined);
  });

  // ── Initial hydration ────────────────────────────────────────────

  it('should show loading state initially', () => {
    renderWithProvider();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('should hydrate user from SecureStore when token exists', async () => {
    mockGetAccessToken.mockResolvedValue('stored-token');
    mockGetUserData.mockResolvedValue(JSON.stringify(testUser));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText('Logged in as Test')).toBeTruthy();
    });
  });

  it('should remain logged out when no token is stored', async () => {
    mockGetAccessToken.mockResolvedValue(null);

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeTruthy();
    });
  });

  it('should remain logged out when token exists but user data is missing', async () => {
    mockGetAccessToken.mockResolvedValue('stored-token');
    mockGetUserData.mockResolvedValue(null);

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeTruthy();
    });
  });

  it('should remain logged out when hydration throws', async () => {
    mockGetAccessToken.mockRejectedValue(new Error('corrupt'));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeTruthy();
    });
  });

  // ── Login ────────────────────────────────────────────────────────

  it('should store tokens and set user on login', async () => {
    mockLoginApi.mockResolvedValue(testAuthResponse);

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeTruthy();
    });

    await act(async () => {
      const loginBtn = screen.getByTestId('login-btn');
      loginBtn.props.onPress();
    });

    await waitFor(() => {
      expect(screen.getByText('Logged in as Test')).toBeTruthy();
    });

    expect(mockLoginApi).toHaveBeenCalledWith({
      email: 'doc@test.com',
      password: 'pass123',
    });
    expect(mockSaveAccessToken).toHaveBeenCalledWith('access-123');
    expect(mockSaveRefreshToken).toHaveBeenCalledWith('refresh-456');
    expect(mockSaveUserData).toHaveBeenCalledWith(JSON.stringify(testUser));
  });

  // ── Logout ───────────────────────────────────────────────────────

  it('should clear auth data and reset user on logout', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockGetUserData.mockResolvedValue(JSON.stringify(testUser));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByText('Logged in as Test')).toBeTruthy();
    });

    await act(async () => {
      const logoutBtn = screen.getByTestId('logout-btn');
      logoutBtn.props.onPress();
    });

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeTruthy();
    });

    expect(mockClearAuthData).toHaveBeenCalled();
  });

  // ── useAuthContext outside provider ──────────────────────────────

  it('should throw when used outside AuthProvider', () => {
    // Suppress console.error for this expected error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useAuthContext must be used within an AuthProvider');

    spy.mockRestore();
  });
});
