'use client';

import Link from 'next/link';
import { CalendarCheck, CheckCircle, Clock, ArrowRight, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useAuthStore } from '@/hooks/use-auth';
import { useMyAppointments } from '@/hooks/use-appointments';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import type { AppointmentStatus } from '@hospital-booking/shared-types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: appointmentsData, isLoading } = useMyAppointments();

  const appointments = appointmentsData?.data ?? [];
  const upcoming = appointments.filter(
    (a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED',
  );
  const completed = appointments.filter((a) => a.status === 'COMPLETED');

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      {/* Welcome */}
      <div className="mb-8 rounded-xl medical-gradient p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.firstName ?? 'Patient'}!
        </h1>
        <p className="mt-1 text-white/80">
          Here&apos;s an overview of your healthcare activity.
        </p>
        <Link href="/doctors">
          <Button
            variant="secondary"
            className="mt-4 bg-white text-primary-700 hover:bg-white/90"
          >
            <Stethoscope className="h-4 w-4" />
            Find a Doctor
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<CalendarCheck className="h-5 w-5 text-primary-600" />}
          label="Total Appointments"
          value={appointments.length}
          bg="bg-primary-50"
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          label="Completed"
          value={completed.length}
          bg="bg-green-50"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-blue-600" />}
          label="Upcoming"
          value={upcoming.length}
          bg="bg-blue-50"
        />
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Upcoming Appointments</CardTitle>
          <Link href="/appointments">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Spinner className="py-8" />
          ) : upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming appointments"
              description="Book an appointment with a doctor to get started."
              actionLabel="Find Doctors"
              onAction={() => (window.location.href = '/doctors')}
            />
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((appt) => {
                const doctorName = appt.doctor?.user
                  ? `Dr. ${appt.doctor.user.firstName} ${appt.doctor.user.lastName}`
                  : 'Doctor';

                return (
                  <Link
                    key={appt.id}
                    href={`/appointments/${appt.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary-50 p-2.5">
                        <CalendarCheck className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doctorName}</p>
                        <p className="text-sm text-gray-500">
                          {appt.doctor?.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(appt.appointmentDateTime)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(appt.appointmentDateTime)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appt.status as AppointmentStatus)}>
                      {appt.status}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-lg p-2.5 ${bg}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
