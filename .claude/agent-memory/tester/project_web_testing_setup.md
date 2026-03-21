---
name: Web app testing setup
description: Vitest + React Testing Library + jsdom testing infrastructure for the Next.js web app at apps/web
type: project
---

Web app (apps/web) uses Vitest + React Testing Library + jsdom for unit tests.

**Why:** The project had no testing infrastructure; this was set up from scratch in March 2026.

**How to apply:**
- Config: `apps/web/vitest.config.ts` with path aliases matching tsconfig
- Setup file: `apps/web/src/test/setup.ts` (mocks next/navigation, next/link, sonner)
- Test files follow `__tests__/*.test.tsx` convention inside each component directory
- Scripts: `test`, `test:watch`, `test:coverage` in apps/web/package.json
- Form components need QueryClientProvider wrapper for react-query hooks
- Auth hooks (use-auth) tested via Zustand store directly (not React Query mutations)
