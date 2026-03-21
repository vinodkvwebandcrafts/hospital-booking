import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from '../login-form';

// Mock useLogin hook
const mockMutateAsync = vi.fn();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/use-auth', () => ({
  useLogin: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render email and password inputs', () => {
      render(<LoginForm />, { wrapper: createWrapper() });
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should render the sign in button', () => {
      render(<LoginForm />, { wrapper: createWrapper() });
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      render(<LoginForm />, { wrapper: createWrapper() });
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    it('should render create account link', () => {
      render(<LoginForm />, { wrapper: createWrapper() });
      expect(screen.getByText(/create one/i)).toBeInTheDocument();
    });

    it('should render remember me checkbox', () => {
      render(<LoginForm />, { wrapper: createWrapper() });
      expect(screen.getByText(/remember me/i)).toBeInTheDocument();
    });
  });

  describe('validation errors', () => {
    it('should show error when email is empty on submit', async () => {
      const user = userEvent.setup();
      render(<LoginForm />, { wrapper: createWrapper() });

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is empty on submit', async () => {
      const user = userEvent.setup();
      render(<LoginForm />, { wrapper: createWrapper() });

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<LoginForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/email address/i), 'notanemail');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is too short', async () => {
      const user = userEvent.setup();
      render(<LoginForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), '12345');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('successful submission', () => {
    it('should call mutateAsync with form data and navigate on success', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce({ accessToken: 'token', user: {} });

      render(<LoginForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should not navigate when mutateAsync returns falsy', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce(null);

      render(<LoginForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalled();
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
