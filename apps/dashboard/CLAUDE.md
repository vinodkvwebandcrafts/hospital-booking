# Dashboard - Vite + React Admin/Doctor Portal

## Overview
Role-based management dashboard for hospital administrators and doctors. Built with Vite, React, React Router v6, and Tailwind CSS.

## Quick Start
```bash
pnpm --filter dashboard dev     # Start dev server on port 5173
```

## Server
- **Port**: 5173 (Vite default)
- **API Proxy**: `/api` → http://localhost:3001/api/v1
- **Auth**: JWT tokens stored in localStorage

## Tech Stack
| Library | Purpose |
|---------|---------|
| Vite 5 | Build tool & dev server |
| React 18 | UI framework |
| React Router v6 | Client-side routing with nested routes |
| Tailwind CSS | Styling (dark sidebar #1e293b, light content) |
| TanStack Query v5 | Server state & caching |
| TanStack Table v8 | Data tables with sorting, filtering, pagination |
| Zustand v5 | Client state (auth) |
| Recharts | Analytics charts (line, bar, pie, area) |
| React Big Calendar | Appointment calendar view |
| React Hook Form + Zod | Form validation |
| Axios | HTTP client |
| Lucide React | Icons |
| Sonner | Toast notifications |
| Papa Parse | CSV export |
| jsPDF + autotable | PDF export |

## Routes
### Admin Routes (role: ADMIN)
```
/login                      → Login page
/admin/dashboard             → KPIs, charts, recent appointments
/admin/doctors               → Doctor CRUD table (add/edit/delete)
/admin/patients              → Patient list with search
/admin/appointments          → List + calendar view toggle
/admin/analytics             → Charts: trends, performance, revenue, growth
```

### Doctor Routes (role: DOCTOR)
```
/doctor/dashboard            → Today's appointments, quick stats
/doctor/appointments         → My appointments (today/upcoming/past tabs)
/doctor/patients             → My patients with medical history
/doctor/schedule             → Manage weekly availability
/doctor/prescriptions        → Create/view prescriptions
```

## RBAC System
- `src/lib/rbac.ts` - Role permission map
- `src/components/shared/ProtectedRoute.tsx` - Route guard checking role
- `src/context/AuthContext.tsx` - Auth state with `hasRole()` and `hasPermission()`
- **Admin**: Full CRUD on doctors, patients, appointments, analytics
- **Doctor**: Read/update appointments, read patients, manage schedule, create prescriptions

## Key Components
| Component | Path | Description |
|-----------|------|-------------|
| DataTable | `components/tables/DataTable.tsx` | Generic TanStack Table with sort/filter/paginate |
| DoctorColumns | `components/tables/DoctorColumns.tsx` | Column defs for doctor table |
| StatsCard | `components/shared/StatsCard.tsx` | KPI card with icon, value, trend |
| Sidebar | `components/shared/Sidebar.tsx` | Collapsible, role-based nav menu |
| AppointmentTrendChart | `components/charts/AppointmentTrendChart.tsx` | Recharts line chart |
| SpecialtyPieChart | `components/charts/SpecialtyPieChart.tsx` | Recharts pie chart |
| RevenueChart | `components/charts/RevenueChart.tsx` | Recharts bar/line chart |
| DoctorForm | `components/forms/DoctorForm.tsx` | Add/edit doctor dialog |
| ScheduleForm | `components/forms/ScheduleForm.tsx` | Weekly availability editor |

## Data Export
- **CSV**: `src/services/export/csvExport.ts` (Papa Parse)
- **PDF**: `src/services/export/pdfExport.ts` (jsPDF + autotable)
- Available on Analytics page and table views

## Hooks
- `useAuth.ts` - Auth context consumer
- `useDoctors.ts` - CRUD queries/mutations
- `usePatients.ts` - List/detail queries
- `useAppointments.ts` - CRUD + status updates
- `useAnalytics.ts` - Dashboard stats, trends, performance
- `useExport.ts` - CSV/PDF export handler

## API Client
- `src/services/api/client.ts` - Axios with auth interceptor
- 401 → refresh token flow → if fails, redirect to /login

## Commands
```bash
pnpm --filter dashboard dev        # Dev server (port 5173)
pnpm --filter dashboard build      # TypeScript + Vite build
pnpm --filter dashboard preview    # Preview production build
pnpm --filter dashboard lint       # ESLint
```

## File Structure
```
src/
├── main.tsx                   # Entry (BrowserRouter, QueryClient, AuthProvider)
├── App.tsx                    # Route definitions
├── router.tsx                 # Route config with lazy loading
├── pages/
│   ├── auth/Login.tsx
│   ├── admin/                 # Dashboard, DoctorManagement, PatientManagement, AppointmentsOverview, Analytics
│   └── doctor/                # Dashboard, MyAppointments, MyPatients, Schedule, Prescriptions
├── components/
│   ├── ui/                    # 12 base components (button, card, dialog, table, etc.)
│   ├── shared/                # Sidebar, Header, ProtectedRoute, StatsCard, PageHeader
│   ├── tables/                # DataTable, DoctorColumns, PatientColumns, AppointmentColumns
│   ├── charts/                # 4 Recharts components
│   └── forms/                 # DoctorForm, PatientForm, PrescriptionForm, ScheduleForm
├── hooks/                     # useAuth, useDoctors, usePatients, useAppointments, useAnalytics, useExport
├── context/AuthContext.tsx     # Auth + RBAC provider
├── services/
│   ├── api/                   # Axios client + endpoint modules
│   └── export/                # csvExport, pdfExport
└── lib/                       # rbac.ts, utils.ts
```
