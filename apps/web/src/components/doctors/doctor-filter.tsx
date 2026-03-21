'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SPECIALIZATIONS } from '@/lib/constants';

interface DoctorFilterProps {
  search: string;
  onSearchChange: (search: string) => void;
  specialization: string;
  onSpecializationChange: (specialization: string) => void;
  availableOnly: boolean;
  onAvailableChange: (available: boolean) => void;
}

export function DoctorFilter({
  search,
  onSearchChange,
  specialization,
  onSpecializationChange,
  availableOnly,
  onAvailableChange,
}: DoctorFilterProps) {
  const specialtyOptions = [
    { value: '', label: 'All Specialties' },
    ...SPECIALIZATIONS.map((s) => ({ value: s, label: s })),
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
        />
      </div>

      <div className="w-full sm:w-56">
        <Select
          options={specialtyOptions}
          value={specialization}
          onChange={(e) => onSpecializationChange(e.target.value)}
          placeholder="All Specialties"
        />
      </div>

      <label className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-700">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailableChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        Available now
      </label>
    </div>
  );
}
