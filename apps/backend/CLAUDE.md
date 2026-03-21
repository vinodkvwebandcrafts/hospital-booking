# Backend - NestJS API

## Overview
Hospital Booking System REST API built with NestJS, TypeORM, PostgreSQL, and Redis.

## Quick Start
```bash
docker-compose up -d          # Start PostgreSQL + Redis (from monorepo root)
pnpm --filter backend dev     # Start dev server (hot reload)
pnpm --filter backend seed    # Seed database with sample data
```

## Server
- **Port**: 3001 (configurable via PORT env var)
- **API Prefix**: `/api/v1`
- **Swagger Docs**: http://localhost:3001/api/docs
- **CORS**: localhost:3000 (web), localhost:8081 (mobile)

## Modules
| Module | Path | Description |
|--------|------|-------------|
| Auth | `src/auth/` | JWT register/login/refresh, Passport strategy |
| Users | `src/users/` | User CRUD, profile, push token storage |
| Doctors | `src/doctors/` | Doctor profiles, availability, slot generation |
| Appointments | `src/appointments/` | Booking with Redis slot locking, status management |
| Medical Records | `src/medical-records/` | Patient records, prescriptions, attachments |
| Notifications | `src/notifications/` | Expo push + email via event emitter |
| Common | `src/common/` | Guards, decorators, filters, interceptors |

## Architecture Patterns
- **Auth**: JWT access token (1h) + refresh token (7d), bcrypt (12 rounds)
- **RBAC**: `@Roles('ADMIN', 'DOCTOR')` decorator + `RolesGuard`
- **Slot Locking**: Redis `SET NX EX` with Lua script release, 10-min TTL
- **Response Format**: All responses wrapped in `{ success, data, message }` via `TransformInterceptor`
- **Error Format**: `{ success: false, statusCode, message, errors, path, timestamp }`
- **Events**: `@nestjs/event-emitter` for decoupled notifications

## Key Decorators
- `@CurrentUser()` - Extract authenticated user from request
- `@Roles('ADMIN')` - Restrict endpoint to specific roles
- `@Public()` - Bypass JWT guard on specific endpoints

## Database
- **ORM**: TypeORM with auto-loaded entities
- **DB**: PostgreSQL (hospital_booking)
- **Migrations**: `src/database/migrations/`
- **Seeds**: `src/database/seeds/seed.ts` (admin@hospital.com / admin123)
- **Critical Constraint**: UNIQUE on `(doctor_id, appointment_datetime)` in appointments table

## Environment Variables
```
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
PORT, NODE_ENV
```

## Commands
```bash
pnpm --filter backend dev          # Dev with hot reload
pnpm --filter backend build        # Production build
pnpm --filter backend start:prod   # Run production
pnpm --filter backend test         # Unit tests
pnpm --filter backend test:e2e     # E2E tests
pnpm --filter backend test:cov     # Coverage report
pnpm --filter backend seed         # Seed database
pnpm --filter backend lint         # Lint & fix
```

## Appointment Booking Flow
1. Patient requests available slots → checks DB + Redis locks
2. Patient selects slot → Redis lock acquired (10-min TTL)
3. Patient confirms → DB insert + lock released + notification event emitted
4. On failure → lock auto-released in catch block

## File Structure
```
src/
├── main.ts                    # Bootstrap (port 3001, Swagger, CORS)
├── app.module.ts              # Root module (TypeORM, Redis, ConfigModule)
├── common/                    # Guards, decorators, filters, interceptors
├── auth/                      # JWT auth (register, login, refresh)
├── users/                     # User CRUD + profile
├── doctors/                   # Doctor CRUD + availability + slot generation
├── appointments/              # Booking + slot-locking/ (Redis)
├── medical-records/           # Records + prescriptions
├── notifications/             # push/ (Expo SDK) + email/ (nodemailer)
└── database/seeds/            # Admin + sample doctors seeder
```
