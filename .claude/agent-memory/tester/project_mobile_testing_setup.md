---
name: Mobile app testing setup
description: Testing framework, conventions, and patterns for the Expo mobile app at apps/mobile/
type: project
---

Mobile app uses jest-expo preset with @testing-library/react-native for component testing.

**Why:** Expo 52 + React Native 0.76 requires jest-expo preset for proper transformation of RN and Expo modules. The `@/` path alias maps to `src/` via moduleNameMapper.

**How to apply:**
- Test files go in `__tests__/` directories next to source files
- Global mocks for expo-secure-store, expo-notifications, expo-device, expo-router, and react-native-reanimated are in `src/test/setup.ts` (loaded via `setupFiles`)
- Component tests override hooks with local `jest.mock()` calls (e.g., mocking `@/hooks/useOffline` in OfflineIndicator tests)
- The shared-types package is mapped via moduleNameMapper to `../../packages/shared-types/src`
- Run tests with `pnpm --filter mobile test`
