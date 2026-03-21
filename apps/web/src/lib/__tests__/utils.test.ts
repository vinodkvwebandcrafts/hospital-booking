import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  formatTime,
  formatDateTime,
  getStatusColor,
  getInitials,
  formatCurrency,
} from '../utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('should merge tailwind classes correctly (tailwind-merge)', () => {
    // tailwind-merge should deduplicate conflicting utilities
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('should return empty string for no arguments', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate', () => {
  it('should format ISO date string to "MMM dd, yyyy"', () => {
    expect(formatDate('2025-03-15T10:00:00Z')).toBe('Mar 15, 2025');
  });

  it('should format another date correctly', () => {
    expect(formatDate('2024-12-25T00:00:00Z')).toBe('Dec 25, 2024');
  });

  it('should return the original string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  it('should handle date-only ISO strings', () => {
    // parseISO can parse date-only strings
    expect(formatDate('2025-01-01')).toBe('Jan 01, 2025');
  });
});

describe('formatTime', () => {
  it('should format ISO date string to "hh:mm a"', () => {
    expect(formatTime('2025-03-15T10:00:00Z')).toBe('10:00 AM');
  });

  it('should format PM time correctly', () => {
    expect(formatTime('2025-03-15T14:30:00Z')).toBe('02:30 PM');
  });

  it('should return the original string for an invalid date', () => {
    expect(formatTime('invalid')).toBe('invalid');
  });

  it('should format midnight correctly', () => {
    expect(formatTime('2025-03-15T00:00:00Z')).toBe('12:00 AM');
  });
});

describe('formatDateTime', () => {
  it('should format ISO date string to "MMM dd, yyyy - hh:mm a"', () => {
    expect(formatDateTime('2025-03-15T10:00:00Z')).toBe(
      'Mar 15, 2025 - 10:00 AM',
    );
  });

  it('should return the original string for an invalid date', () => {
    expect(formatDateTime('bad')).toBe('bad');
  });
});

describe('getStatusColor', () => {
  it('should return blue classes for SCHEDULED', () => {
    expect(getStatusColor('SCHEDULED' as any)).toBe(
      'bg-blue-100 text-blue-800',
    );
  });

  it('should return green classes for CONFIRMED', () => {
    expect(getStatusColor('CONFIRMED' as any)).toBe(
      'bg-green-100 text-green-800',
    );
  });

  it('should return gray classes for COMPLETED', () => {
    expect(getStatusColor('COMPLETED' as any)).toBe(
      'bg-gray-100 text-gray-800',
    );
  });

  it('should return red classes for CANCELLED', () => {
    expect(getStatusColor('CANCELLED' as any)).toBe(
      'bg-red-100 text-red-800',
    );
  });

  it('should return yellow classes for NO_SHOW', () => {
    expect(getStatusColor('NO_SHOW' as any)).toBe(
      'bg-yellow-100 text-yellow-800',
    );
  });

  it('should return default gray classes for unknown status', () => {
    expect(getStatusColor('UNKNOWN' as any)).toBe(
      'bg-gray-100 text-gray-800',
    );
  });
});

describe('getInitials', () => {
  it('should return uppercase initials from first and last name', () => {
    expect(getInitials('John', 'Doe')).toBe('JD');
  });

  it('should handle lowercase names', () => {
    expect(getInitials('john', 'doe')).toBe('JD');
  });

  it('should handle single character names', () => {
    expect(getInitials('A', 'B')).toBe('AB');
  });

  it('should return uppercase even if input is already uppercase', () => {
    expect(getInitials('ALICE', 'BOB')).toBe('AB');
  });
});

describe('formatCurrency', () => {
  it('should format a number as USD currency', () => {
    expect(formatCurrency(150)).toBe('$150.00');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format decimal amounts', () => {
    expect(formatCurrency(99.99)).toBe('$99.99');
  });

  it('should format large numbers with comma separators', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format negative amounts', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });
});
