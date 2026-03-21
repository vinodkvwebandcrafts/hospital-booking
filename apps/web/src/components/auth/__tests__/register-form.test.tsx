import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegisterForm } from '../register-form';

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
  usePathname: () => '/register',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/use-auth', () => ({
  useRegister: () => ({
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

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
  await user.type(screen.getByLabelText(/phone number/i), '+1 555 000 0000');
  await user.type(screen.getByLabelText(/^password$/i), 'Password1');
  await user.type(screen.getByLabelText(/confirm password/i), 'Password1');
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all form fields', () => {
      render(<RegisterForm />, { wrapper: createWrapper() });
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('should render the create account button', () => {
      render(<RegisterForm />, { wrapper: createWrapper() });
      expect(
        screen.getByRole('button', { name: /create account/i }),
      ).toBeInTheDocument();
    });

    it('should render sign in link', () => {
      render(<RegisterForm />, { wrapper: createWrapper() });
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });
  });

  describe('validation errors', () => {
    it('should show required errors when submitting empty form', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for short first name', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/first name/i), 'J');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/first name must be at least 2 characters/i),
        ).toBeInTheDocument();
      });
    });

    it('should show error for invalid email', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/email address/i), 'bad-email');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/^password$/i), 'Short1');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 8 characters/i),
        ).toBeInTheDocument();
      });
    });

    it('should show error when password has no uppercase', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/^password$/i), 'password1');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/password must contain at least one uppercase letter/i),
        ).toBeInTheDocument();
      });
    });

    it('should show error when password has no number', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/^password$/i), 'Passwordd');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/password must contain at least one number/i),
        ).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<RegisterForm />, { wrapper: createWrapper() });

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '+1 555 000 0000');
      await user.type(screen.getByLabelText(/^password$/i), 'Password1');
      await user.type(screen.getByLabelText(/confirm password/i), 'Different1');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  describe('successful submission', () => {
    it('should call mutateAsync with form data (without confirmPassword) and navigate', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce({ accessToken: 'token', user: {} });

      render(<RegisterForm />, { wrapper: createWrapper() });
      await fillValidForm(user);
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1 555 000 0000',
          password: 'Password1',
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should not navigate when mutateAsync returns falsy', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce(null);

      render(<RegisterForm />, { wrapper: createWrapper() });
      await fillValidForm(user);
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalled();
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
