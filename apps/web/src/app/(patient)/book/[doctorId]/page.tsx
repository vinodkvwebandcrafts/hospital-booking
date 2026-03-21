'use client';

import { use } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { BookingWizard } from '@/components/appointments/booking-wizard';
import { Spinner } from '@/components/ui/spinner';
import { useDoctor } from '@/hooks/use-doctors';

interface BookPageProps {
  params: Promise<{ doctorId: string }>;
}

export default function BookPage({ params }: BookPageProps) {
  const { doctorId } = use(params);
  const { data: doctor, isLoading } = useDoctor(doctorId);

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
    : 'Doctor';

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <PageHeader
        title="Book Appointment"
        description={`Schedule an appointment with ${doctorName}`}
        breadcrumbs={[
          { label: 'Doctors', href: '/doctors' },
          { label: doctorName, href: `/doctors/${doctor.id}` },
          { label: 'Book Appointment' },
        ]}
      />
      <BookingWizard doctor={doctor} />
    </div>
  );
}
