export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export const SPECIALIZATIONS = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
] as const;

export const APPOINTMENT_STATUSES = {
  SCHEDULED: { label: 'Scheduled', color: 'blue' },
  CONFIRMED: { label: 'Confirmed', color: 'green' },
  COMPLETED: { label: 'Completed', color: 'gray' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  NO_SHOW: { label: 'No Show', color: 'yellow' },
} as const;

export const CONSULTATION_TYPES = {
  IN_PERSON: { label: 'In Person', icon: 'building' },
  VIDEO_CALL: { label: 'Video Call', icon: 'video' },
  PHONE: { label: 'Phone', icon: 'phone' },
} as const;

export const AUTH_TOKEN_KEY = 'hospital_booking_token';
export const AUTH_REFRESH_KEY = 'hospital_booking_refresh';
