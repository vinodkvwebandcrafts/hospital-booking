import { NavLink, useLocation } from 'react-router-dom';
import { UserRole } from '@hospital-booking/shared-types';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  BarChart3,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Doctors', path: '/admin/doctors', icon: <Stethoscope className="h-5 w-5" /> },
  { label: 'Patients', path: '/admin/patients', icon: <Users className="h-5 w-5" /> },
  { label: 'Appointments', path: '/admin/appointments', icon: <CalendarDays className="h-5 w-5" /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
];

const doctorNav: NavItem[] = [
  { label: 'Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Appointments', path: '/doctor/appointments', icon: <CalendarDays className="h-5 w-5" /> },
  { label: 'My Patients', path: '/doctor/patients', icon: <Users className="h-5 w-5" /> },
  { label: 'Schedule', path: '/doctor/schedule', icon: <Clock className="h-5 w-5" /> },
  { label: 'Prescriptions', path: '/doctor/prescriptions', icon: <FileText className="h-5 w-5" /> },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = user?.role === UserRole.ADMIN ? adminNav : doctorNav;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-700/50 bg-sidebar transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-700/50 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600">
          <Activity className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="truncate text-base font-bold text-white">MedBooking</h1>
            <p className="truncate text-xs text-sidebar-muted">
              {user?.role === UserRole.ADMIN ? 'Admin Panel' : 'Doctor Portal'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-link',
                isActive ? 'sidebar-link-active' : 'sidebar-link-inactive',
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-slate-700/50 p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
