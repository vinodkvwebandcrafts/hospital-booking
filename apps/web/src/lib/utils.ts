import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import type { AppointmentStatus } from '@hospital-booking/shared-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'hh:mm a');
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy - hh:mm a');
  } catch {
    return dateString;
  }
}

export function getStatusColor(status: AppointmentStatus): string {
  const colors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-800';
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
