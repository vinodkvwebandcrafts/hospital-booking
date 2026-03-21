'use client';

import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import type { Appointment } from '@hospital-booking/shared-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';
import { CONSULTATION_TYPES } from '@/lib/constants';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}

export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const doctorName = appointment.doctor?.user
    ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`
    : 'Doctor';

  const canCancel =
    appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary-50 p-2.5">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{doctorName}</h4>
              {appointment.doctor && (
                <p className="text-sm text-gray-500">
                  {appointment.doctor.specialization}
                </p>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            {formatDate(appointment.appointmentDateTime)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            {formatTime(appointment.appointmentDateTime)}
          </div>
          <Badge variant="outline">
            {CONSULTATION_TYPES[appointment.consultationType]?.label ?? appointment.consultationType}
          </Badge>
        </div>

        {appointment.reason && (
          <p className="mt-3 text-sm text-gray-500 line-clamp-2">
            {appointment.reason}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Link href={`/appointments/${appointment.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          {canCancel && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => onCancel(appointment.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
