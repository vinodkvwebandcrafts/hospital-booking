import { useMemo, useState } from 'react';
import { AppointmentStatus, type Appointment } from '@hospital-booking/shared-types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getInitials, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  SCHEDULED: 'default',
  CONFIRMED: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  NO_SHOW: 'secondary',
};

const statusOptions = [
  { value: AppointmentStatus.CONFIRMED, label: 'Confirm' },
  { value: AppointmentStatus.COMPLETED, label: 'Complete' },
  { value: AppointmentStatus.CANCELLED, label: 'Cancel' },
  { value: AppointmentStatus.NO_SHOW, label: 'No Show' },
];

// Mock appointments with more detail
const mockAppointments: Appointment[] = [
  {
    id: 'a1', doctorId: '1', patientId: 'p1', appointmentDateTime: '2026-03-21T10:00:00Z',
    durationMinutes: 30, status: AppointmentStatus.CONFIRMED, consultationType: 'IN_PERSON' as never,
    consultationFee: 150, reminderSent: true, reason: 'Annual checkup', notes: 'Patient reports no issues.',
    createdAt: '2026-03-18', updatedAt: '2026-03-20',
    patient: { id: 'p1', email: 'sarah@email.com', firstName: 'Sarah', lastName: 'Johnson', phone: '+1234567800', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a2', doctorId: '1', patientId: 'p2', appointmentDateTime: '2026-03-21T11:30:00Z',
    durationMinutes: 30, status: AppointmentStatus.SCHEDULED, consultationType: 'VIDEO_CALL' as never,
    consultationFee: 150, reminderSent: false, reason: 'Follow-up',
    createdAt: '2026-03-19', updatedAt: '2026-03-19',
    patient: { id: 'p2', email: 'james@email.com', firstName: 'James', lastName: 'Wilson', phone: '+1234567801', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a3', doctorId: '1', patientId: 'p3', appointmentDateTime: '2026-03-22T14:00:00Z',
    durationMinutes: 30, status: AppointmentStatus.SCHEDULED, consultationType: 'IN_PERSON' as never,
    consultationFee: 150, reminderSent: false, reason: 'Chest pain',
    createdAt: '2026-03-20', updatedAt: '2026-03-20',
    patient: { id: 'p3', email: 'maria@email.com', firstName: 'Maria', lastName: 'Garcia', phone: '+1234567802', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a4', doctorId: '1', patientId: 'p4', appointmentDateTime: '2026-03-18T09:00:00Z',
    durationMinutes: 30, status: AppointmentStatus.COMPLETED, consultationType: 'IN_PERSON' as never,
    consultationFee: 150, reminderSent: true, reason: 'Blood pressure check', notes: 'BP normal. Continue medication.',
    createdAt: '2026-03-15', updatedAt: '2026-03-18',
    patient: { id: 'p4', email: 'robert@email.com', firstName: 'Robert', lastName: 'Davis', phone: '+1234567803', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a5', doctorId: '1', patientId: 'p5', appointmentDateTime: '2026-03-15T15:30:00Z',
    durationMinutes: 30, status: AppointmentStatus.COMPLETED, consultationType: 'PHONE' as never,
    consultationFee: 150, reminderSent: true, reason: 'Medication review',
    createdAt: '2026-03-12', updatedAt: '2026-03-15',
    patient: { id: 'p5', email: 'anna@email.com', firstName: 'Anna', lastName: 'Miller', phone: '+1234567804', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
];

export default function MyAppointments() {
  const [tab, setTab] = useState('today');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    switch (tab) {
      case 'today':
        return mockAppointments.filter(
          (a) => a.appointmentDateTime.startsWith('2026-03-21'),
        );
      case 'upcoming':
        return mockAppointments.filter(
          (a) =>
            new Date(a.appointmentDateTime) > new Date() &&
            (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.CONFIRMED),
        );
      case 'past':
        return mockAppointments.filter(
          (a) => a.status === AppointmentStatus.COMPLETED || a.status === AppointmentStatus.CANCELLED,
        );
      default:
        return mockAppointments;
    }
  }, [tab]);

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  const columns: ColumnDef<Appointment>[] = useMemo(
    () => [
      {
        accessorKey: 'patient',
        header: 'Patient',
        enableSorting: false,
        cell: ({ row }) => {
          const patient = row.original.patient;
          if (!patient) return '-';
          return (
            <div className="flex items-center gap-3">
              <Avatar fallback={getInitials(patient.firstName, patient.lastName)} size="sm" />
              <div>
                <p className="font-medium text-gray-900">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-xs text-gray-500">{patient.phone}</p>
              </div>
            </div>
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
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-700">{getValue<string>() ?? '-'}</span>
        ),
      },
      {
        accessorKey: 'consultationType',
        header: 'Type',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="text-xs">
            {String(getValue()).replace('_', ' ')}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant[status]}>{status}</Badge>
              {(status === AppointmentStatus.SCHEDULED || status === AppointmentStatus.CONFIRMED) && (
                <Select
                  options={statusOptions}
                  value=""
                  onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
                  className="h-7 w-28 text-xs"
                  placeholder="Update"
                />
              )}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setExpandedRow(expandedRow === row.original.id ? null : row.original.id)
              }
            >
              {expandedRow === row.original.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [expandedRow],
  );

  return (
    <div>
      <PageHeader title="My Appointments" description="Manage your patient appointments" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <DataTable columns={columns} data={filteredAppointments} pageSize={10} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
