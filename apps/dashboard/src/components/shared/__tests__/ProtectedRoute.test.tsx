import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { UserRole } from '@hospital-booking/shared-types';

// Track Navigate calls
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  Navigate: (props: { to: string; state?: unknown; replace?: boolean }) => {
    mockNavigate(props);
    return <div data-testid="navigate" data-to={props.to} />;
  },
  useLocation: () => ({ pathname: '/admin/dashboard', search: '', hash: '', state: null, key: 'default' }),
}));

vi.mock('@/components/ui/spinner', () => ({
  Spinner: ({ size }: { size?: string }) => <div data-testid="spinner" data-size={size} />,
}));

// Mock useAuth — we control return values per test
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('should render spinner while authentication is loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('unauthenticated user', () => {
    it('should redirect to /login when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should pass current location as state for redirect', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      render(
        <ProtectedRoute>
          <div>Content</div>
        </ProtectedRoute>,
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          to: '/login',
          state: expect.objectContaining({ from: expect.any(Object) }),
          replace: true,
        }),
      );
    });
  });

  describe('authenticated user without role restrictions', () => {
    it('should render children when authenticated and no allowedRoles specified', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', role: UserRole.ADMIN, email: 'admin@test.com', firstName: 'Admin', lastName: 'User' },
      });

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('role-based access control', () => {
    it('should render children when user role is in allowedRoles', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', role: UserRole.ADMIN, email: 'admin@test.com', firstName: 'Admin', lastName: 'User' },
      });

      render(
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <div>Admin Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should redirect admin away from doctor-only routes', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', role: UserRole.ADMIN, email: 'admin@test.com', firstName: 'Admin', lastName: 'User' },
      });

      render(
        <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
          <div>Doctor Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByText('Doctor Content')).not.toBeInTheDocument();
    });

    it('should redirect doctor away from admin-only routes', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '2', role: UserRole.DOCTOR, email: 'doc@test.com', firstName: 'Dr', lastName: 'Smith' },
      });

      render(
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <div>Admin Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should allow access when multiple roles are permitted', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '2', role: UserRole.DOCTOR, email: 'doc@test.com', firstName: 'Dr', lastName: 'Smith' },
      });

      render(
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.DOCTOR]}>
          <div>Shared Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByText('Shared Content')).toBeInTheDocument();
    });

    it('should redirect patient from admin/doctor routes', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '3', role: UserRole.PATIENT, email: 'patient@test.com', firstName: 'John', lastName: 'Doe' },
      });

      render(
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.DOCTOR]}>
          <div>Staff Content</div>
        </ProtectedRoute>,
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
      expect(screen.queryByText('Staff Content')).not.toBeInTheDocument();
    });
  });
});
