/** Base URL for the backend API. Replace with your actual server URL. */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

/** Keys used for secure storage */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
} as const;

/** App-wide colour palette */
export const COLORS = {
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  primaryDark: '#1d4ed8',
  secondary: '#64748b',
  success: '#16a34a',
  successLight: '#dcfce7',
  warning: '#d97706',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  info: '#0891b2',
  infoLight: '#cffafe',
  white: '#ffffff',
  background: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;
