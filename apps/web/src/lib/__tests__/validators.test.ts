import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  bookingSchema,
  profileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
} from '../validators';

describe('loginSchema', () => {
  it('should validate correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email is required');
    }
  });

  it('should reject invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Invalid email address');
    }
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password is required');
    }
  });

  it('should reject password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must be at least 6 characters');
    }
  });

  it('should accept password of exactly 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });
});

describe('registerSchema', () => {
  const validData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 555 000 0000',
    password: 'Password1',
    confirmPassword: 'Password1',
  };

  it('should validate correct registration data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty first name', () => {
    const result = registerSchema.safeParse({ ...validData, firstName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('First name is required');
    }
  });

  it('should reject first name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validData, firstName: 'J' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('First name must be at least 2 characters');
    }
  });

  it('should reject empty last name', () => {
    const result = registerSchema.safeParse({ ...validData, lastName: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid phone number', () => {
    const result = registerSchema.safeParse({ ...validData, phone: '123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Invalid phone number');
    }
  });

  it('should accept phone with various formats', () => {
    const phones = ['+1 555 000 0000', '(555) 000-0000', '5550000000'];
    for (const phone of phones) {
      const result = registerSchema.safeParse({ ...validData, phone });
      expect(result.success).toBe(true);
    }
  });

  it('should reject password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'Pass1',
      confirmPassword: 'Pass1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must be at least 8 characters');
    }
  });

  it('should reject password without uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'password1',
      confirmPassword: 'password1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain(
        'Password must contain at least one uppercase letter',
      );
    }
  });

  it('should reject password without a number', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'Passwordd',
      confirmPassword: 'Passwordd',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain(
        'Password must contain at least one number',
      );
    }
  });

  it('should reject when passwords do not match', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'Password1',
      confirmPassword: 'Different1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Passwords do not match');
    }
  });

  it('should reject empty confirmPassword', () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('bookingSchema', () => {
  const validBooking = {
    date: '2025-04-01',
    timeSlot: '09:00',
    reason: 'Annual checkup',
    consultationType: 'IN_PERSON' as const,
  };

  it('should validate correct booking data', () => {
    const result = bookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it('should reject empty date', () => {
    const result = bookingSchema.safeParse({ ...validBooking, date: '' });
    expect(result.success).toBe(false);
  });

  it('should reject empty timeSlot', () => {
    const result = bookingSchema.safeParse({ ...validBooking, timeSlot: '' });
    expect(result.success).toBe(false);
  });

  it('should reject empty reason', () => {
    const result = bookingSchema.safeParse({ ...validBooking, reason: '' });
    expect(result.success).toBe(false);
  });

  it('should reject reason over 500 characters', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      reason: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Reason must be under 500 characters');
    }
  });

  it('should accept reason of exactly 500 characters', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      reason: 'a'.repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it('should accept all valid consultation types', () => {
    for (const type of ['IN_PERSON', 'VIDEO_CALL', 'PHONE'] as const) {
      const result = bookingSchema.safeParse({
        ...validBooking,
        consultationType: type,
      });
      expect(result.success).toBe(true);
    }
  });

  it('should reject invalid consultation type', () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      consultationType: 'INVALID',
    });
    expect(result.success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('should validate with required fields only', () => {
    const result = profileSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    });
    expect(result.success).toBe(true);
  });

  it('should validate with all optional fields', () => {
    const result = profileSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: '123 Main St',
      city: 'Springfield',
      country: 'US',
      postalCode: '12345',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty firstName', () => {
    const result = profileSchema.safeParse({
      firstName: '',
      lastName: 'Doe',
      phone: '+1234567890',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty lastName', () => {
    const result = profileSchema.safeParse({
      firstName: 'John',
      lastName: '',
      phone: '+1234567890',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty phone', () => {
    const result = profileSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      phone: '',
    });
    expect(result.success).toBe(false);
  });

  it('should allow optional fields to be undefined', () => {
    const result = profileSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: undefined,
      gender: undefined,
    });
    expect(result.success).toBe(true);
  });
});

describe('changePasswordSchema', () => {
  const validData = {
    currentPassword: 'OldPassword1',
    newPassword: 'NewPassword1',
    confirmNewPassword: 'NewPassword1',
  };

  it('should validate correct data', () => {
    const result = changePasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty current password', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      currentPassword: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject new password shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: 'Short1',
      confirmNewPassword: 'Short1',
    });
    expect(result.success).toBe(false);
  });

  it('should reject new password without uppercase', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: 'newpassword1',
      confirmNewPassword: 'newpassword1',
    });
    expect(result.success).toBe(false);
  });

  it('should reject new password without number', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: 'NewPassword',
      confirmNewPassword: 'NewPassword',
    });
    expect(result.success).toBe(false);
  });

  it('should reject when new passwords do not match', () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: 'NewPassword1',
      confirmNewPassword: 'Different1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Passwords do not match');
    }
  });
});

describe('forgotPasswordSchema', () => {
  it('should validate correct email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('should reject empty email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});
