import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, AuthContext, type AuthContextValue } from '../AuthContext';
import { UserRole } from '@hospital-booking/shared-types';
import { useContext } from 'react';

// Mock authApi
const mockLogin = vi.fn();
vi.mock('@/services/api/authApi', () => ({
  authApi: {
    login: (...args: unknown[]) => mockLogin(...args),
  },
}));

// Mock apiClient
vi.mock('@/services/api/client', () => ({
  apiClient: {
    defaults: {
      headers: {
        common: {} as Record<string, string>,
      },
    },
  },
}));

// Helper to consume AuthContext in tests
function AuthConsumer({ onRender }: { onRender: (ctx: AuthContextValue) => void }) {
  const ctx = useContext(AuthContext);
  if (ctx) onRender(ctx);
  return (
    <div>
      <span data-testid="authenticated">{ctx?.isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="user-email">{ctx?.user?.email ?? 'none'}</span>
      <span data-testid="user-role">{ctx?.user?.role ?? 'none'}</span>
      <span data-testid="loading">{ctx?.isLoading ? 'yes' : 'no'}</span>
    </div>
  );
}

// Helper that exposes the context for imperative calls
function TestHarness() {
  const ctx = useContext(AuthContext);
  return (
    <div>
      <span data-testid="authenticated">{ctx?.isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="user-email">{ctx?.user?.email ?? 'none'}</span>
      <span data-testid="loading">{ctx?.isLoading ? 'yes' : 'no'}</span>
      <button data-testid="login-btn" onClick={() => ctx?.login('admin@test.com', 'password123')}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={() => ctx?.logout()}>
        Logout
      </button>
      <span data-testid="has-admin-role">{ctx?.hasRole(UserRole.ADMIN) ? 'yes' : 'no'}</span>
      <span data-testid="has-doctor-role">{ctx?.hasRole(UserRole.DOCTOR) ? 'yes' : 'no'}</span>
      <span data-testid="has-dashboard-perm">{ctx?.hasPermission('dashboard:view') ? 'yes' : 'no'}</span>
      <span data-testid="has-doctor-create-perm">{ctx?.hasPermission('doctors:create') ? 'yes' : 'no'}</span>
    </div>
  );
}

const mockUser = {
  id: '1',
  email: 'admin@test.com',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+1 555 0000',
  role: UserRole.ADMIN,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('AuthContext', () => {
  let localStorageStore: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageStore = {};

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return localStorageStore[key] ?? null;
    });

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      localStorageStore[key] = value;
    });

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete localStorageStore[key];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should be unauthenticated by default when no stored token', () => {
      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      expect(screen.getByTestId('user-email')).toHaveTextContent('none');
    });

    it('should restore user and token from localStorage', () => {
      localStorageStore['dashboard_access_token'] = 'stored-token';
      localStorageStore['dashboard_user'] = JSON.stringify(mockUser);

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      expect(screen.getByTestId('user-email')).toHaveTextContent('admin@test.com');
    });

    it('should not be loading initially', () => {
      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('no');
    });
  });

  describe('login', () => {
    it('should authenticate user on successful login', async () => {
      mockLogin.mockResolvedValueOnce({
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        user: mockUser,
      });

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');

      await userEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });
      expect(screen.getByTestId('user-email')).toHaveTextContent('admin@test.com');
    });

    it('should store tokens and user in localStorage on login', async () => {
      mockLogin.mockResolvedValueOnce({
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
        user: mockUser,
      });

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      await userEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(localStorageStore['dashboard_access_token']).toBe('access-123');
      });
      expect(localStorageStore['dashboard_refresh_token']).toBe('refresh-456');
      expect(localStorageStore['dashboard_user']).toBe(JSON.stringify(mockUser));
    });

    it('should call authApi.login with email and password', async () => {
      mockLogin.mockResolvedValueOnce({
        accessToken: 'token',
        refreshToken: 'refresh',
        user: mockUser,
      });

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      await userEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'admin@test.com',
          password: 'password123',
        });
      });
    });

    it('should set isLoading to false after login completes', async () => {
      mockLogin.mockResolvedValueOnce({
        accessToken: 'token',
        refreshToken: 'refresh',
        user: mockUser,
      });

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      await userEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('no');
      });
    });

    it('should set isLoading to false even when login fails', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      await userEvent.click(screen.getByTestId('login-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('no');
      });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    });
  });

  describe('logout', () => {
    it('should clear user and token on logout', async () => {
      localStorageStore['dashboard_access_token'] = 'stored-token';
      localStorageStore['dashboard_user'] = JSON.stringify(mockUser);

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');

      await userEvent.click(screen.getByTestId('logout-btn'));

      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      expect(screen.getByTestId('user-email')).toHaveTextContent('none');
    });

    it('should remove tokens from localStorage on logout', async () => {
      localStorageStore['dashboard_access_token'] = 'stored-token';
      localStorageStore['dashboard_refresh_token'] = 'stored-refresh';
      localStorageStore['dashboard_user'] = JSON.stringify(mockUser);

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      await userEvent.click(screen.getByTestId('logout-btn'));

      expect(localStorageStore['dashboard_access_token']).toBeUndefined();
      expect(localStorageStore['dashboard_refresh_token']).toBeUndefined();
      expect(localStorageStore['dashboard_user']).toBeUndefined();
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the specified role', () => {
      localStorageStore['dashboard_access_token'] = 'token';
      localStorageStore['dashboard_user'] = JSON.stringify(mockUser);

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('has-admin-role')).toHaveTextContent('yes');
    });

    it('should return false when user does not have the specified role', () => {
      localStorageStore['dashboard_access_token'] = 'token';
      localStorageStore['dashboard_user'] = JSON.stringify(mockUser);

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('has-doctor-role')).toHaveTextContent('no');
    });

    it('should return false when no user is logged in', () => {
      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('has-admin-role')).toHaveTextContent('no');
    });
  });

  describe('hasPermission', () => {
    it('should return true when admin has dashboard:view', () => {
      localStorageStore['dashboard_access_token'] = 'token';
      localStorageStore['dashboard_user'] = JSON.stringify(mockUser);

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('has-dashboard-perm')).toHaveTextContent('yes');
    });

    it('should return true when admin has doctors:create', () => {
      localStorageStore['dashboard_access_token'] = 'token';
      localStorageStore['dashboard_user'] = JSON.stringify(mockUser);

      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('has-doctor-create-perm')).toHaveTextContent('yes');
    });

    it('should return false when no user is logged in', () => {
      render(
        <AuthProvider>
          <TestHarness />
        </AuthProvider>,
      );

      expect(screen.getByTestId('has-dashboard-perm')).toHaveTextContent('no');
    });
  });
});
