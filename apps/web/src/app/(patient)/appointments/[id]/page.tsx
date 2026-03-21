'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, FileText, Video, Phone, Building } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { CancelDialog } from '@/components/appointments/cancel-dialog';
import { useAppointment, useCancelAppointment } from '@/hooks/use-appointments';
import { formatDate, formatTime, getStatusColor, getInitials, formatCurrency } from '@/lib/utils';
import { CONSULTATION_TYPES } from '@/lib/constants';
import type { AppointmentStatus } from '@hospital-booking/shared-types';

interface AppointmentDetailPageProps {
  params: Promise<{ id: string }>;
}

const consultationIcons: Record<string, React.ReactNode> = {
  IN_PERSON: <Building className="h-4 w-4" />,
  VIDEO_CALL: <Video className="h-4 w-4" />,
  PHONE: <Phone className="h-4 w-4" />,
};

export default function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  const { id } = use(params);
  const { data: appointment, isLoading } = useAppointment(id);
  const cancelMutation = useCancelAppointment();
  const [showCancel, setShowCancel] = useState(false);

  if (isLoading) return <Spinner className="py-20" />;

  if (!appointment) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Appointment not found.</p>
      </div>
    );
  }

  const doctor = appointment.doctor;
  const doctorName = doctor?.user
    ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`
    : 'Doctor';
  const initials = doctor?.user
    ? getInitials(doctor.user.firstName, doctor.user.lastName)
    : 'DR';

  const canCancel =
    appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';

  const handleCancel = async () => {
    await cancelMutation.mutateAsync(id);
    setShowCancel(false);
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <PageHeader
        title="Appointment Details"
        breadcrumbs={[
          { label: 'Appointments', href: '/appointments' },
          { label: 'Details' },
        ]}
      />

      <div className="space-y-6">
        {/* Status */}
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className={`mt-1 text-sm ${getStatusColor(appointment.status as AppointmentStatus)}`}>
                {appointment.status}
              </Badge>
            </div>
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancel(true)}
              >
                Cancel Appointment
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Doctor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar fallback={initials} size="lg" />
              <div>
                <p className="text-lg font-semibold text-gray-900">{doctorName}</p>
                {doctor && (
                  <p className="text-sm text-gray-500">{doctor.specialization}</p>
                )}
                {doctor?.clinicName && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {doctor.clinicName}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(appointment.appointmentDateTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-50 p-2">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(appointment.appointmentDateTime)} ({appointment.durationMinutes} min)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-50 p-2">
                  {consultationIcons[appointment.consultationType] ?? <Building className="h-4 w-4 text-purple-600" />}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {CONSULTATION_TYPES[appointment.consultationType]?.label ?? appointment.consultationType}
                  </p>
                </div>
              </div>

              {appointment.consultationFee != null && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-50 p-2">
                    <span className="text-sm font-bold text-yellow-600">$</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fee</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(appointment.consultationFee)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {appointment.reason && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-700">Reason for Visit</p>
                  <p className="mt-1 text-sm text-gray-600">{appointment.reason}</p>
                </div>
              </>
            )}

            {appointment.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700">Notes</p>
                <p className="mt-1 text-sm text-gray-600">{appointment.notes}</p>
              </div>
            )}

            {appointment.meetingLink && (
              <div>
                <p className="text-sm font-medium text-gray-700">Meeting Link</p>
                <a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Video className="h-4 w-4" />
                  Join Video Call
                </a>
              </div>
            )}

            {appointment.status === 'COMPLETED' && (
              <>
                <Separator />
                <Link href="/medical-records">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                    View Medical Records
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <CancelDialog
        open={showCancel}
        onOpenChange={setShowCancel}
        onConfirm={handleCancel}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
