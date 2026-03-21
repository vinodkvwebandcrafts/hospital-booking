import { UserRole } from '@hospital-booking/shared-types';

export type Permission =
  | 'dashboard:view'
  | 'doctors:list'
  | 'doctors:create'
  | 'doctors:edit'
  | 'doctors:delete'
  | 'patients:list'
  | 'patients:view'
  | 'patients:edit'
  | 'appointments:list'
  | 'appointments:create'
  | 'appointments:edit'
  | 'appointments:cancel'
  | 'appointments:view-all'
  | 'analytics:view'
  | 'schedule:manage'
  | 'prescriptions:create'
  | 'prescriptions:view'
  | 'medical-records:create'
  | 'medical-records:view';

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'dashboard:view',
    'doctors:list',
    'doctors:create',
    'doctors:edit',
    'doctors:delete',
    'patients:list',
    'patients:view',
    'patients:edit',
    'appointments:list',
    'appointments:create',
    'appointments:edit',
    'appointments:cancel',
    'appointments:view-all',
    'analytics:view',
  ],
  [UserRole.DOCTOR]: [
    'dashboard:view',
    'patients:list',
    'patients:view',
    'appointments:list',
    'appointments:edit',
    'appointments:cancel',
    'schedule:manage',
    'prescriptions:create',
    'prescriptions:view',
    'medical-records:create',
    'medical-records:view',
  ],
  [UserRole.PATIENT]: [],
};

export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return getPermissions(role).includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  const userPermissions = getPermissions(role);
  return permissions.some((p) => userPermissions.includes(p));
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole === requiredRole;
}
