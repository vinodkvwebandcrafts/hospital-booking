'use client';

import { use } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DoctorProfile } from '@/components/doctors/doctor-profile';
import { Spinner } from '@/components/ui/spinner';
import { useDoctor } from '@/hooks/use-doctors';

interface DoctorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  const { id } = use(params);
  const { data: doctor, isLoading } = useDoctor(id);

  if (isLoading) {
    return <Spinner className="py-20" />;
  }

  if (!doctor) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Doctor not found.</p>
      </div>
    );
  }

  const doctorName = doctor.user
    ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`
    : 'Doctor Profile';

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <PageHeader
        title={doctorName}
        breadcrumbs={[
          { label: 'Doctors', href: '/doctors' },
          { label: doctorName },
        ]}
      />
      <DoctorProfile doctor={doctor} />
    </div>
  );
}
