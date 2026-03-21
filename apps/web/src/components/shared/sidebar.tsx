'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  CalendarCheck,
  FileText,
  UserCircle,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/medical-records', label: 'Records', icon: FileText },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Heart className="h-7 w-7 text-primary-600" />
        <span className="text-xl font-bold text-gray-900">MediBook</span>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
