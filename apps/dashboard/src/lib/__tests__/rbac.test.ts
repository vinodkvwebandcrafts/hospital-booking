import { UserRole } from '@hospital-booking/shared-types';
import {
  getPermissions,
  hasPermission,
  hasAnyPermission,
  hasRole,
  type Permission,
} from '../rbac';

describe('rbac', () => {
  describe('getPermissions', () => {
    it('should return all admin permissions', () => {
      const perms = getPermissions(UserRole.ADMIN);
      expect(perms).toContain('dashboard:view');
      expect(perms).toContain('doctors:list');
      expect(perms).toContain('doctors:create');
      expect(perms).toContain('doctors:edit');
      expect(perms).toContain('doctors:delete');
      expect(perms).toContain('patients:list');
      expect(perms).toContain('patients:view');
      expect(perms).toContain('patients:edit');
      expect(perms).toContain('appointments:list');
      expect(perms).toContain('appointments:create');
      expect(perms).toContain('appointments:edit');
      expect(perms).toContain('appointments:cancel');
      expect(perms).toContain('appointments:view-all');
      expect(perms).toContain('analytics:view');
    });

    it('should return all doctor permissions', () => {
      const perms = getPermissions(UserRole.DOCTOR);
      expect(perms).toContain('dashboard:view');
      expect(perms).toContain('patients:list');
      expect(perms).toContain('patients:view');
      expect(perms).toContain('appointments:list');
      expect(perms).toContain('appointments:edit');
      expect(perms).toContain('appointments:cancel');
      expect(perms).toContain('schedule:manage');
      expect(perms).toContain('prescriptions:create');
      expect(perms).toContain('prescriptions:view');
      expect(perms).toContain('medical-records:create');
      expect(perms).toContain('medical-records:view');
    });

    it('should return empty permissions for patient role', () => {
      const perms = getPermissions(UserRole.PATIENT);
      expect(perms).toEqual([]);
    });

    it('should return empty array for unknown role', () => {
      const perms = getPermissions('UNKNOWN' as UserRole);
      expect(perms).toEqual([]);
    });
  });

  describe('hasPermission', () => {
    // Admin permissions
    it('should return true for admin with doctors:create', () => {
      expect(hasPermission(UserRole.ADMIN, 'doctors:create')).toBe(true);
    });

    it('should return true for admin with analytics:view', () => {
      expect(hasPermission(UserRole.ADMIN, 'analytics:view')).toBe(true);
    });

    it('should return false for admin with schedule:manage (doctor-only)', () => {
      expect(hasPermission(UserRole.ADMIN, 'schedule:manage')).toBe(false);
    });

    it('should return false for admin with prescriptions:create (doctor-only)', () => {
      expect(hasPermission(UserRole.ADMIN, 'prescriptions:create')).toBe(false);
    });

    // Doctor permissions
    it('should return true for doctor with schedule:manage', () => {
      expect(hasPermission(UserRole.DOCTOR, 'schedule:manage')).toBe(true);
    });

    it('should return true for doctor with prescriptions:create', () => {
      expect(hasPermission(UserRole.DOCTOR, 'prescriptions:create')).toBe(true);
    });

    it('should return false for doctor with doctors:create (admin-only)', () => {
      expect(hasPermission(UserRole.DOCTOR, 'doctors:create')).toBe(false);
    });

    it('should return false for doctor with doctors:delete (admin-only)', () => {
      expect(hasPermission(UserRole.DOCTOR, 'doctors:delete')).toBe(false);
    });

    it('should return false for doctor with analytics:view (admin-only)', () => {
      expect(hasPermission(UserRole.DOCTOR, 'analytics:view')).toBe(false);
    });

    // Patient permissions
    it('should return false for patient with any permission', () => {
      expect(hasPermission(UserRole.PATIENT, 'dashboard:view')).toBe(false);
      expect(hasPermission(UserRole.PATIENT, 'appointments:list')).toBe(false);
    });

    // Shared permissions
    it('should grant dashboard:view to both admin and doctor', () => {
      expect(hasPermission(UserRole.ADMIN, 'dashboard:view')).toBe(true);
      expect(hasPermission(UserRole.DOCTOR, 'dashboard:view')).toBe(true);
    });

    it('should grant appointments:edit to both admin and doctor', () => {
      expect(hasPermission(UserRole.ADMIN, 'appointments:edit')).toBe(true);
      expect(hasPermission(UserRole.DOCTOR, 'appointments:edit')).toBe(true);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one of the requested permissions', () => {
      expect(
        hasAnyPermission(UserRole.DOCTOR, ['doctors:create', 'schedule:manage']),
      ).toBe(true);
    });

    it('should return false when user has none of the requested permissions', () => {
      expect(
        hasAnyPermission(UserRole.DOCTOR, ['doctors:create', 'doctors:delete', 'analytics:view']),
      ).toBe(false);
    });

    it('should return false for empty permissions array', () => {
      expect(hasAnyPermission(UserRole.ADMIN, [])).toBe(false);
    });

    it('should return true when all requested permissions are granted', () => {
      expect(
        hasAnyPermission(UserRole.ADMIN, ['doctors:create', 'doctors:edit']),
      ).toBe(true);
    });

    it('should return false for patient with any permissions', () => {
      expect(
        hasAnyPermission(UserRole.PATIENT, ['dashboard:view', 'appointments:list']),
      ).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when roles match', () => {
      expect(hasRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
      expect(hasRole(UserRole.DOCTOR, UserRole.DOCTOR)).toBe(true);
      expect(hasRole(UserRole.PATIENT, UserRole.PATIENT)).toBe(true);
    });

    it('should return false when roles do not match', () => {
      expect(hasRole(UserRole.ADMIN, UserRole.DOCTOR)).toBe(false);
      expect(hasRole(UserRole.DOCTOR, UserRole.ADMIN)).toBe(false);
      expect(hasRole(UserRole.PATIENT, UserRole.ADMIN)).toBe(false);
    });
  });
});
