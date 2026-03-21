import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { AppointmentTrendChart } from '@/components/charts/AppointmentTrendChart';
import { SpecialtyPieChart } from '@/components/charts/SpecialtyPieChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardStats } from '@/hooks/useAnalytics';
import { formatCurrency, getInitials } from '@/lib/utils';
import { Stethoscope, Users, CalendarDays, DollarSign } from 'lucide-react';
import type { AppointmentStatus } from '@hospital-booking/shared-types';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  SCHEDULED: 'default',
  CONFIRMED: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  NO_SHOW: 'secondary',
};

// Mock recent appointments for display
const recentAppointments = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Michael Chen',
    date: '2026-03-21 10:00',
    status: 'CONFIRMED' as AppointmentStatus,
    fee: 150,
  },
  {
    id: '2',
    patientName: 'James Wilson',
    doctorName: 'Dr. Emily Brown',
    date: '2026-03-21 11:30',
    status: 'SCHEDULED' as AppointmentStatus,
    fee: 200,
  },
  {
    id: '3',
    patientName: 'Maria Garcia',
    doctorName: 'Dr. David Kim',
    date: '2026-03-21 14:00',
    status: 'COMPLETED' as AppointmentStatus,
    fee: 175,
  },
  {
    id: '4',
    patientName: 'Robert Davis',
    doctorName: 'Dr. Lisa Wang',
    date: '2026-03-21 15:30',
    status: 'CANCELLED' as AppointmentStatus,
    fee: 120,
  },
  {
    id: '5',
    patientName: 'Anna Miller',
    doctorName: 'Dr. Michael Chen',
    date: '2026-03-21 16:00',
    status: 'SCHEDULED' as AppointmentStatus,
    fee: 150,
  },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const dashboardStats = stats ?? {
    totalDoctors: 48,
    totalPatients: 980,
    todayAppointments: 32,
    revenue: 285400,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  };

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Overview of your hospital operations" />

      {/* KPI cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Doctors"
          value={dashboardStats.totalDoctors}
          icon={<Stethoscope className="h-6 w-6" />}
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatsCard
          title="Total Patients"
          value={dashboardStats.totalPatients.toLocaleString()}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 8.2, label: 'vs last month' }}
        />
        <StatsCard
          title="Today's Appointments"
          value={dashboardStats.todayAppointments}
          icon={<CalendarDays className="h-6 w-6" />}
          trend={{ value: -3.1, label: 'vs yesterday' }}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats.revenue)}
          icon={<DollarSign className="h-6 w-6" />}
          trend={{ value: 15.4, label: 'vs last month' }}
        />
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppointmentTrendChart />
        </div>
        <div>
          <SpecialtyPieChart />
        </div>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    fallback={getInitials(
                      apt.patientName.split(' ')[0],
                      apt.patientName.split(' ')[1],
                    )}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{apt.patientName}</p>
                    <p className="text-xs text-gray-500">{apt.doctorName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={statusVariant[apt.status]}>{apt.status}</Badge>
                  <p className="mt-1 text-xs text-gray-500">{formatCurrency(apt.fee)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
