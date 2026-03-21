'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, LogOut, User, ChevronDown, Heart } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore, useLogout } from '@/hooks/use-auth';
import { getInitials } from '@/lib/utils';

export function Header() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <Heart className="h-6 w-6 text-primary-600" />
        <span className="text-lg font-bold text-gray-900">MediBook</span>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
          >
            <Avatar
              fallback={user ? getInitials(user.firstName, user.lastName) : '?'}
              size="sm"
            />
            <span className="hidden text-sm font-medium text-gray-700 md:block">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-fade-in">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
