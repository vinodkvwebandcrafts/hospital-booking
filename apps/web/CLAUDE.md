# Web - Next.js Patient App

## Overview
Patient-facing web application for browsing doctors, booking appointments, and managing health records. Built with Next.js 15 (App Router), Tailwind CSS, and shadcn-style components.

## Quick Start
```bash
pnpm --filter web dev     # Start dev server on port 3000
```

## Server
- **Port**: 3000
- **API**: Proxies to backend at http://localhost:3001/api/v1
- **Auth Token**: Stored in localStorage (`hospital_booking_token`)

## Tech Stack
| Library | Purpose |
|---------|---------|
| Next.js 15 | App Router, SSR, middleware |
| React 19 | UI framework |
| Tailwind CSS | Styling (primary: #2563eb blue) |
| shadcn/ui style | Button, Card, Dialog, Input, Badge, etc. |
| TanStack Query v5 | Server state & caching |
| Zustand v5 | Client state (auth store) |
| React Hook Form + Zod | Form validation |
| Axios | HTTP client with auth interceptor |
| Lucide React | Icons |
| Sonner | Toast notifications |
| date-fns | Date formatting |

## Pages
```
/                          → Landing page (hero, features, CTA)
/login                     → Patient login
/register                  → Patient registration
/forgot-password           → Password reset request
/dashboard                 → Patient dashboard (upcoming appointments, stats)
/doctors                   → Doctor list with filters (specialty, availability)
/doctors/[id]              → Doctor profile + available slots
/book/[doctorId]           → 4-step booking wizard
/appointments              → My appointments (upcoming/past tabs)
/appointments/[id]         → Appointment detail + cancel
/medical-records           → Medical records list
/medical-records/[id]      → Record detail (diagnosis, prescriptions, attachments)
/profile                   → Edit profile + change password
```

## Route Groups
- `(auth)/` - Login, register, forgot-password (centered card layout)
- `(patient)/` - Protected patient pages (sidebar + header layout)

## Middleware
- `src/middleware.ts` - Redirects unauthenticated users to `/login`, redirects authenticated users away from auth pages

## Key Components
| Component | Path | Description |
|-----------|------|-------------|
| BookingWizard | `components/appointments/booking-wizard.tsx` | 4-step: date → time → details → confirm |
| TimeSlotSelector | `components/appointments/time-slot-selector.tsx` | Green=available, gray=booked, yellow=locked |
| DoctorCard | `components/doctors/doctor-card.tsx` | Card with rating, specialty, book button |
| DoctorFilter | `components/doctors/doctor-filter.tsx` | Search + specialty + availability filters |
| Sidebar | `components/shared/sidebar.tsx` | Navigation: Dashboard, Doctors, Appointments, Records, Profile |
| Header | `components/shared/header.tsx` | Logo, notification bell, user dropdown |

## Hooks
- `use-auth.ts` - Zustand store: login, register, logout, getCurrentUser
- `use-doctors.ts` - useDoctors(filters), useDoctor(id), useDoctorSlots(doctorId, date)
- `use-appointments.ts` - useMyAppointments, useAppointment, useCreateAppointment, useCancelAppointment
- `use-medical-records.ts` - useMyRecords, useRecord(id)

## API Client
- `src/lib/api.ts` - Axios instance with Bearer token interceptor
- 401 responses → clear token + redirect to /login
- SSR-safe (checks `typeof window`)

## Validation Schemas (Zod)
- `loginSchema` - email + password
- `registerSchema` - firstName, lastName, email, phone, password, confirmPassword
- `bookingSchema` - doctorId, date, timeSlot, reason, consultationType
- `profileSchema` - all user fields
- `changePasswordSchema` - currentPassword, newPassword, confirmPassword

## Commands
```bash
pnpm --filter web dev          # Dev server (port 3000)
pnpm --filter web build        # Production build
pnpm --filter web start        # Start production
pnpm --filter web lint         # Next.js lint
pnpm --filter web type-check   # TypeScript check
```

## File Structure
```
src/
├── app/
│   ├── layout.tsx             # Root (Inter font, providers, toaster)
│   ├── page.tsx               # Landing page
│   ├── middleware.ts          # Auth redirect logic
│   ├── (auth)/                # Login, register, forgot-password
│   └── (patient)/             # Dashboard, doctors, appointments, records, profile
├── components/
│   ├── ui/                    # 10 base components (button, card, dialog, etc.)
│   ├── shared/                # Header, sidebar, page-header, skeletons
│   ├── auth/                  # Login & register forms
│   ├── doctors/               # Doctor card, filter, profile
│   └── appointments/          # Booking wizard, time slots, cancel dialog
├── hooks/                     # useAuth, useDoctors, useAppointments, useRecords
└── lib/                       # api.ts, utils.ts, validators.ts, constants.ts
```
