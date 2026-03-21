import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { AppointmentStatus, type Appointment } from '@hospital-booking/shared-types';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { getAppointmentColumns } from '@/components/tables/AppointmentColumns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppointments } from '@/hooks/useAppointments';
import { List, CalendarDays, Search } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: AppointmentStatus.SCHEDULED, label: 'Scheduled' },
  { value: AppointmentStatus.CONFIRMED, label: 'Confirmed' },
  { value: AppointmentStatus.COMPLETED, label: 'Completed' },
  { value: AppointmentStatus.CANCELLED, label: 'Cancelled' },
  { value: AppointmentStatus.NO_SHOW, label: 'No Show' },
];

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: 'a1', doctorId: '1', patientId: 'p1', appointmentDateTime: '2026-03-21T10:00:00Z',
    durationMinutes: 30, status: AppointmentStatus.CONFIRMED, consultationType: 'IN_PERSON' as never,
    consultationFee: 150, reminderSent: true, createdAt: '2026-03-18', updatedAt: '2026-03-20',
    reason: 'Annual checkup',
    doctor: { id: '1', userId: 'u1', specialization: 'Cardiology', averageRating: 4.8, totalReviews: 124, appointmentDurationMinutes: 30, isAvailable: true, createdAt: '', updatedAt: '', user: { id: 'u1', email: '', firstName: 'Michael', lastName: 'Chen', phone: '', role: 'DOCTOR' as never, isActive: true, createdAt: '', updatedAt: '' } },
    patient: { id: 'p1', email: 'sarah@email.com', firstName: 'Sarah', lastName: 'Johnson', phone: '', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a2', doctorId: '2', patientId: 'p2', appointmentDateTime: '2026-03-21T11:30:00Z',
    durationMinutes: 20, status: AppointmentStatus.SCHEDULED, consultationType: 'VIDEO_CALL' as never,
    consultationFee: 200, reminderSent: false, createdAt: '2026-03-19', updatedAt: '2026-03-19',
    reason: 'Skin rash',
    doctor: { id: '2', userId: 'u2', specialization: 'Dermatology', averageRating: 4.6, totalReviews: 89, appointmentDurationMinutes: 20, isAvailable: true, createdAt: '', updatedAt: '', user: { id: 'u2', email: '', firstName: 'Emily', lastName: 'Brown', phone: '', role: 'DOCTOR' as never, isActive: true, createdAt: '', updatedAt: '' } },
    patient: { id: 'p2', email: 'james@email.com', firstName: 'James', lastName: 'Wilson', phone: '', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a3', doctorId: '3', patientId: 'p3', appointmentDateTime: '2026-03-22T14:00:00Z',
    durationMinutes: 45, status: AppointmentStatus.COMPLETED, consultationType: 'IN_PERSON' as never,
    consultationFee: 175, reminderSent: true, createdAt: '2026-03-15', updatedAt: '2026-03-22',
    reason: 'Follow-up',
    doctor: { id: '3', userId: 'u3', specialization: 'Neurology', averageRating: 4.9, totalReviews: 156, appointmentDurationMinutes: 45, isAvailable: true, createdAt: '', updatedAt: '', user: { id: 'u3', email: '', firstName: 'David', lastName: 'Kim', phone: '', role: 'DOCTOR' as never, isActive: true, createdAt: '', updatedAt: '' } },
    patient: { id: 'p3', email: 'maria@email.com', firstName: 'Maria', lastName: 'Garcia', phone: '', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a4', doctorId: '1', patientId: 'p4', appointmentDateTime: '2026-03-23T09:00:00Z',
    durationMinutes: 30, status: AppointmentStatus.CANCELLED, consultationType: 'PHONE' as never,
    consultationFee: 120, reminderSent: true, createdAt: '2026-03-16', updatedAt: '2026-03-20',
    cancelledAt: '2026-03-20', reason: 'Chest pain',
    doctor: { id: '1', userId: 'u1', specialization: 'Cardiology', averageRating: 4.8, totalReviews: 124, appointmentDurationMinutes: 30, isAvailable: true, createdAt: '', updatedAt: '', user: { id: 'u1', email: '', firstName: 'Michael', lastName: 'Chen', phone: '', role: 'DOCTOR' as never, isActive: true, createdAt: '', updatedAt: '' } },
    patient: { id: 'p4', email: 'robert@email.com', firstName: 'Robert', lastName: 'Davis', phone: '', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
  {
    id: 'a5', doctorId: '4', patientId: 'p5', appointmentDateTime: '2026-03-24T15:30:00Z',
    durationMinutes: 30, status: AppointmentStatus.SCHEDULED, consultationType: 'IN_PERSON' as never,
    consultationFee: 150, reminderSent: false, createdAt: '2026-03-20', updatedAt: '2026-03-20',
    reason: 'Vaccination',
    doctor: { id: '4', userId: 'u4', specialization: 'Pediatrics', averageRating: 4.7, totalReviews: 201, appointmentDurationMinutes: 30, isAvailable: true, createdAt: '', updatedAt: '', user: { id: 'u4', email: '', firstName: 'Lisa', lastName: 'Wang', phone: '', role: 'DOCTOR' as never, isActive: true, createdAt: '', updatedAt: '' } },
    patient: { id: 'p5', email: 'anna@email.com', firstName: 'Anna', lastName: 'Miller', phone: '', role: 'PATIENT' as never, isActive: true, createdAt: '', updatedAt: '' },
  },
];

export default function AppointmentsOverview() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: appointmentsData, isLoading } = useAppointments({
    status: (statusFilter || undefined) as AppointmentStatus | undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const appointments = appointmentsData?.data ?? mockAppointments;

  const filteredAppointments = useMemo(() => {
    let result = appointments;
    if (statusFilter) {
      result = result.filter((a) => a.status === statusFilter);
    }
    return result;
  }, [appointments, statusFilter]);

  const calendarEvents = useMemo(
    () =>
      filteredAppointments.map((apt) => ({
        id: apt.id,
        title: `${apt.patient?.firstName ?? 'Patient'} - ${apt.doctor?.user?.lastName ? 'Dr. ' + apt.doctor.user.lastName : 'Doctor'}`,
        start: new Date(apt.appointmentDateTime),
        end: new Date(
          new Date(apt.appointmentDateTime).getTime() + apt.durationMinutes * 60000,
        ),
      })),
    [filteredAppointments],
  );

  const columns = useMemo(() => getAppointmentColumns(), []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="View and manage all appointments"
        action={
          <div className="flex gap-2">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="mr-1 h-4 w-4" /> List
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('calendar')}
            >
              <CalendarDays className="mr-1 h-4 w-4" /> Calendar
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="w-full sm:w-44"
        />
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full sm:w-40"
          placeholder="From date"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-full sm:w-40"
          placeholder="To date"
        />
      </div>

      {view === 'list' ? (
        <DataTable columns={columns} data={filteredAppointments} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={['month', 'week', 'day']}
            defaultView="week"
          />
        </div>
      )}
    </div>
  );
}
