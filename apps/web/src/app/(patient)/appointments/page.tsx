'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { AppointmentCard } from '@/components/appointments/appointment-card';
import { CancelDialog } from '@/components/appointments/cancel-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useMyAppointments, useCancelAppointment } from '@/hooks/use-appointments';
import { CalendarCheck } from 'lucide-react';

export default function AppointmentsPage() {
  const [tab, setTab] = useState('upcoming');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { data, isLoading } = useMyAppointments();
  const cancelMutation = useCancelAppointment();

  const appointments = data?.data ?? [];
  const upcoming = appointments.filter(
    (a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED',
  );
  const past = appointments.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'CANCELLED' || a.status === 'NO_SHOW',
  );

  const handleCancel = async () => {
    if (!cancelId) return;
    await cancelMutation.mutateAsync(cancelId);
    setCancelId(null);
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <PageHeader
        title="My Appointments"
        description="View and manage all your appointments."
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <Spinner className="py-12" />
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={<CalendarCheck className="h-8 w-8 text-gray-400" />}
              title="No upcoming appointments"
              description="You don't have any scheduled appointments. Find a doctor and book one."
              actionLabel="Find Doctors"
              onAction={() => (window.location.href = '/doctors')}
            />
          ) : (
            <div className="space-y-4">
              {upcoming.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={(id) => setCancelId(id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {isLoading ? (
            <Spinner className="py-12" />
          ) : past.length === 0 ? (
            <EmptyState
              icon={<CalendarCheck className="h-8 w-8 text-gray-400" />}
              title="No past appointments"
              description="Your completed and cancelled appointments will appear here."
            />
          ) : (
            <div className="space-y-4">
              {past.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CancelDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        onConfirm={handleCancel}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
