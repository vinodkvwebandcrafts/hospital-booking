import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../LoginForm';

// Mock the useAuth hook
const mockLogin = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────────

  it('should render the login form with email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
    expect(screen.getByPlaceholderText('doctor@hospital.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('should render the sign-in button', () => {
    render(<LoginForm />);
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('should render header text', () => {
    render(<LoginForm />);
    expect(screen.getByText('Hospital Booking')).toBeTruthy();
    expect(screen.getByText('Sign in to your account')).toBeTruthy();
  });

  // ── Validation ───────────────────────────────────────────────────

  it('should show error when email is empty on submit', async () => {
    render(<LoginForm />);
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
    });
  });

  it('should show error for invalid email format', async () => {
    render(<LoginForm />);
    fireEvent.changeText(screen.getByPlaceholderText('doctor@hospital.com'), 'notanemail');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Enter a valid email')).toBeTruthy();
    });
  });

  it('should show error when password is empty on submit', async () => {
    render(<LoginForm />);
    fireEvent.changeText(screen.getByPlaceholderText('doctor@hospital.com'), 'test@email.com');
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
  });

  it('should show error when password is too short', async () => {
    render(<LoginForm />);
    fireEvent.changeText(screen.getByPlaceholderText('doctor@hospital.com'), 'test@email.com');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), '12345');
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('should show both errors when both fields are empty', async () => {
    render(<LoginForm />);
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
  });

  // ── Successful submission ────────────────────────────────────────

  it('should call login with trimmed email and password on valid submit', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm />);
    fireEvent.changeText(screen.getByPlaceholderText('doctor@hospital.com'), '  doc@test.com  ');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'secure123');
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'doc@test.com',
        password: 'secure123',
      });
    });
  });

  // ── Error handling ───────────────────────────────────────────────

  it('should show alert when login throws an Error', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    jest.spyOn(Alert, 'alert');

    render(<LoginForm />);
    fireEvent.changeText(screen.getByPlaceholderText('doctor@hospital.com'), 'doc@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Error', 'Invalid credentials');
    });
  });

  it('should show generic message when login throws a non-Error', async () => {
    mockLogin.mockRejectedValue('network failure');
    jest.spyOn(Alert, 'alert');

    render(<LoginForm />);
    fireEvent.changeText(screen.getByPlaceholderText('doctor@hospital.com'), 'doc@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Error',
        'Login failed. Please try again.',
      );
    });
  });
});
