# Mobile - React Native Expo App

## Overview
Mobile app for doctors and admins to manage appointments, receive push notifications, and perform quick actions. Built with Expo 52 and expo-router (file-based routing).

## Quick Start
```bash
pnpm --filter mobile dev      # Start Expo dev server
pnpm --filter mobile android  # Start on Android
pnpm --filter mobile ios      # Start on iOS
```

## App Config
- **Bundle ID**: com.hospitalbooking.app (iOS + Android)
- **Scheme**: hospital-booking (deep linking)
- **Orientation**: Portrait
- **Theme**: Light mode, primary blue (#2563eb)

## Tech Stack
| Library | Purpose |
|---------|---------|
| Expo 52 | React Native framework |
| expo-router 4 | File-based navigation |
| React Native 0.76 | UI framework |
| TanStack Query v5 | Server state (2-min staleTime, 2 retries) |
| Zustand v5 | Client state |
| Axios | HTTP client |
| expo-secure-store | Secure token storage |
| expo-notifications | Push notifications |
| expo-device | Device info for push token |
| react-native-mmkv | High-performance local storage |
| react-native-reanimated | Animations |
| date-fns | Date formatting |

## Navigation Structure
```
_layout.tsx (root)
├── (auth)/
│   └── login.tsx
└── (authenticated)/
    ├── (doctor-tabs)/          # Bottom tabs: Home, Appointments, Patients, Profile
    │   ├── index.tsx           # Doctor dashboard
    │   ├── appointments/
    │   │   ├── index.tsx       # Appointment list (Today/Upcoming/Past)
    │   │   └── [id].tsx        # Detail + status update + notes
    │   ├── patients/
    │   │   ├── index.tsx       # Patient list with search
    │   │   └── [id].tsx        # Patient detail + history
    │   └── profile.tsx         # Profile + settings + logout
    └── (admin-tabs)/           # Bottom tabs: Overview, Doctors, Appointments, Settings
        ├── index.tsx           # Admin dashboard (stats cards)
        ├── doctors/
        │   ├── index.tsx       # Doctor list with search
        │   └── [id].tsx        # Doctor detail + schedule
        ├── appointments/
        │   ├── index.tsx       # All appointments + filter chips
        │   └── [id].tsx        # Appointment detail
        └── settings.tsx        # Notification prefs + logout
```

## Push Notifications
1. **Registration**: `usePushNotifications` hook → requests permissions → gets Expo push token → sends to backend
2. **Foreground**: Shows alert + plays sound via `setNotificationHandler`
3. **Background tap**: Navigates to relevant screen via notification response listener
4. **Android**: Custom channel "hospital-booking" with max importance

## Auth Flow
1. App loads → check SecureStore for token
2. If token → navigate to `(authenticated)` → route by role (DOCTOR/ADMIN)
3. If no token → navigate to `(auth)/login`
4. Login → store tokens in SecureStore → redirect
5. Logout → clear SecureStore → redirect to login

## Storage Keys
- `hospital_booking_access_token` - JWT access token
- `hospital_booking_refresh_token` - JWT refresh token
- `hospital_booking_user_data` - Cached user JSON

## API Client
- `src/services/api/client.ts` - Axios with auth interceptor (reads token from SecureStore)
- Base URL: configurable via `EXPO_PUBLIC_API_URL` (default: http://localhost:3000/api)

## Design Tokens
- **Primary**: #2563eb (blue)
- **Success**: #22c55e, **Warning**: #f59e0b, **Danger**: #ef4444
- **Spacing**: 4px scale (xs=4, sm=8, md=12, lg=16, xl=20, 2xl=24, 3xl=32)
- **Font Sizes**: xs=12, sm=14, md=16, lg=18, xl=20, 2xl=24, 3xl=30
- **Border Radius**: sm=6, md=8, lg=12, xl=16, full=9999

## Key Components
| Component | Path | Description |
|-----------|------|-------------|
| Button | `components/common/Button.tsx` | 4 variants, 3 sizes, loading state |
| Card | `components/common/Card.tsx` | Rounded white card with shadow |
| Input | `components/common/Input.tsx` | TextInput with label + error |
| Badge | `components/common/Badge.tsx` | 5 color variants |
| AppointmentCard | `components/appointments/AppointmentCard.tsx` | List item with avatar, status |
| StatusBadge | `components/appointments/StatusBadge.tsx` | Colored appointment status |
| OfflineIndicator | `components/common/OfflineIndicator.tsx` | Yellow banner when offline |
| LoginForm | `components/auth/LoginForm.tsx` | Email/password with validation |

## Hooks
- `useAuth` - Login, logout, auth state from context
- `useAppointments` - useTodayAppointments, useAppointments(filters), useAppointmentDetail, useUpdateAppointment
- `usePushNotifications` - Token registration + notification listeners
- `useOffline` - Network connectivity check (periodic polling)

## Commands
```bash
pnpm --filter mobile dev           # Expo dev server
pnpm --filter mobile android       # Android emulator
pnpm --filter mobile ios           # iOS simulator
pnpm --filter mobile web           # Web browser
pnpm --filter mobile build         # Expo export
pnpm --filter mobile lint          # ESLint
pnpm --filter mobile type-check    # TypeScript check
```

## File Structure
```
src/
├── app/                       # Expo Router screens
│   ├── _layout.tsx            # Root (providers, push setup, offline indicator)
│   ├── index.tsx              # Entry redirect
│   ├── (auth)/                # Login screen
│   └── (authenticated)/       # Role-based tab navigators
├── components/
│   ├── common/                # 9 base components (Button, Card, Input, etc.)
│   ├── appointments/          # AppointmentCard, StatusBadge
│   └── auth/                  # LoginForm
├── hooks/                     # useAuth, useAppointments, usePushNotifications, useOffline
├── services/
│   ├── api/                   # Axios client + auth, appointments, doctors endpoints
│   ├── notifications/         # Handler + token manager
│   └── storage/               # SecureStore wrapper
├── context/AuthContext.tsx     # Auth provider
├── config/constants.ts        # API URL, colors, spacing, fonts
└── types/                     # Navigation params + shared type re-exports
```

## Monorepo Notes
- `metro.config.js` has `watchFolders` pointing to monorepo root for packages resolution
- Uses `@hospital-booking/shared-types` workspace dependency
