import type { ColumnDef } from '@tanstack/react-table';
import type { Appointment, AppointmentStatus } from '@hospital-booking/shared-types';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { getInitials, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

const statusVariantMap: Record<AppointmentStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  SCHEDULED: 'default',
  CONFIRMED: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  NO_SHOW: 'secondary',
};

export function getAppointmentColumns(): ColumnDef<Appointment>[] {
  return [
    {
      accessorKey: 'patient',
      header: 'Patient',
      enableSorting: false,
      cell: ({ row }) => {
        const patient = row.original.patient;
        if (!patient) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex items-center gap-3">
            <Avatar fallback={getInitials(patient.firstName, patient.lastName)} size="sm" />
            <div>
              <p className="font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'doctor',
      header: 'Doctor',
      enableSorting: false,
      cell: ({ row }) => {
        const doctor = row.original.doctor;
        const user = doctor?.user;
        if (!user) return <span className="text-gray-400">-</span>;
        return (
          <p className="text-sm">
            Dr. {user.firstName} {user.lastName}
          </p>
        );
      },
    },
    {
      accessorKey: 'appointmentDateTime',
      header: 'Date & Time',
      cell: ({ getValue }) => {
        const dt = getValue<string>();
        return (
          <div>
            <p className="font-medium">{format(new Date(dt), 'MMM d, yyyy')}</p>
            <p className="text-xs text-gray-500">{format(new Date(dt), 'h:mm a')}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'consultationType',
      header: 'Type',
      cell: ({ getValue }) => {
        const type = getValue<string>();
        return (
          <Badge variant="secondary" className="text-xs">
            {type.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue<AppointmentStatus>();
        return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'consultationFee',
      header: 'Fee',
      cell: ({ getValue }) => {
        const fee = getValue<number>();
        return fee ? formatCurrency(fee) : '-';
      },
    },
  ];
}
