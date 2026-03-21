# Hospital Appointment & Management System

## Project Overview
Full-stack hospital booking system with 4 apps in a Turborepo + pnpm monorepo.

## Architecture
- **apps/backend** - NestJS API (TypeORM + PostgreSQL + Redis)
- **apps/web** - Next.js Patient App (App Router + Tailwind + shadcn/ui)
- **apps/dashboard** - Vite + React Admin/Doctor Dashboard
- **apps/mobile** - React Native Expo Mobile App
- **packages/shared-types** - Shared TypeScript interfaces
- **packages/api-client** - Shared axios-based API client
- **packages/config** - Shared ESLint, TypeScript, Prettier configs

## Commands
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all apps (Turborepo parallel)
pnpm build                # Build all apps
pnpm lint                 # Lint all apps
pnpm test                 # Run all tests

# Per-app commands
pnpm --filter backend dev
pnpm --filter web dev
pnpm --filter dashboard dev
pnpm --filter mobile start

# Docker
docker-compose up -d      # Start PostgreSQL + Redis
docker-compose down       # Stop services
```

## Key Conventions
- **Auth**: JWT access + refresh tokens, bcrypt password hashing
- **Roles**: PATIENT, DOCTOR, ADMIN (enforced via RolesGuard)
- **Slot Locking**: Redis SET NX EX with 10-min TTL, Lua script release
- **DB**: PostgreSQL with TypeORM, unique constraint on (doctor_id, appointment_datetime)
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **UI**: shadcn/ui + Tailwind CSS on both web apps
- **Validation**: class-validator (backend), zod + react-hook-form (frontend)
- **Notifications**: expo-server-sdk (backend) → expo-notifications (mobile)

## Database
- PostgreSQL on port 5432 (db: hospital_booking, user: postgres, pass: postgres)
- Redis on port 6379

## API Base URL
- Development: http://localhost:3001/api/v1
- Backend runs on port 3001, web on 3000, dashboard on 5173

## Testing
- Backend: Jest (unit + integration)
- Frontend: Vitest + React Testing Library
- Dashboard: Vitest + React Testing Library
- Mobile: Jest + React Native Testing Library
- E2E: Playwright
