'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DoctorCard } from '@/components/doctors/doctor-card';
import { DoctorFilter } from '@/components/doctors/doctor-filter';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useDoctors } from '@/hooks/use-doctors';
import { Stethoscope } from 'lucide-react';

export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const { data, isLoading } = useDoctors({
    search: search || undefined,
    specialization: specialization || undefined,
    isAvailable: availableOnly || undefined,
  });

  const doctors = data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <PageHeader
        title="Find a Doctor"
        description="Browse our network of healthcare professionals and book an appointment."
      />

      <div className="mb-6">
        <DoctorFilter
          search={search}
          onSearchChange={setSearch}
          specialization={specialization}
          onSpecializationChange={setSpecialization}
          availableOnly={availableOnly}
          onAvailableChange={setAvailableOnly}
        />
      </div>

      {isLoading ? (
        <Spinner className="py-16" />
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-8 w-8 text-gray-400" />}
          title="No doctors found"
          description="Try adjusting your search filters to find available doctors."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
