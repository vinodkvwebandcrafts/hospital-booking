import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/avatar';
import { DropdownMenu, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import {
  Menu,
  Bell,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const breadcrumbLabels: Record<string, string> = {
  admin: 'Admin',
  doctor: 'Doctor',
  dashboard: 'Dashboard',
  doctors: 'Doctors',
  patients: 'Patients',
  appointments: 'Appointments',
  analytics: 'Analytics',
  schedule: 'Schedule',
  prescriptions: 'Prescriptions',
};

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((seg) => breadcrumbLabels[seg] ?? seg);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? 'font-medium text-gray-900'
                    : 'text-gray-500'
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User menu */}
        <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100">
              <Avatar
                fallback={user ? getInitials(user.firstName, user.lastName) : '?'}
                size="sm"
              />
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role.toLowerCase()}
                </p>
              </div>
            </button>
          }
        >
          <DropdownItem>
            <User className="h-4 w-4" /> Profile
          </DropdownItem>
          <DropdownItem>
            <Settings className="h-4 w-4" /> Settings
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem destructive onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </DropdownItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
