import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import {
  CalendarDays,
  CalendarCheck,
  Users,
  Star,
  Clock,
  Video,
  Phone,
  MapPin,
} from 'lucide-react';

const consultationIcon: Record<string, React.ReactNode> = {
  IN_PERSON: <MapPin className="h-4 w-4" />,
  VIDEO_CALL: <Video className="h-4 w-4" />,
  PHONE: <Phone className="h-4 w-4" />,
};

const todaysAppointments = [
  {
    id: '1',
    time: '09:00 AM',
    patientName: 'Sarah Johnson',
    reason: 'Annual checkup',
    type: 'IN_PERSON',
    status: 'CONFIRMED',
  },
  {
    id: '2',
    time: '10:00 AM',
    patientName: 'James Wilson',
    reason: 'Follow-up on blood test',
    type: 'VIDEO_CALL',
    status: 'CONFIRMED',
  },
  {
    id: '3',
    time: '11:30 AM',
    patientName: 'Maria Garcia',
    reason: 'Chest pain consultation',
    type: 'IN_PERSON',
    status: 'SCHEDULED',
  },
  {
    id: '4',
    time: '02:00 PM',
    patientName: 'Robert Davis',
    reason: 'Prescription renewal',
    type: 'PHONE',
    status: 'SCHEDULED',
  },
  {
    id: '5',
    time: '03:30 PM',
    patientName: 'Anna Miller',
    reason: 'Initial consultation',
    type: 'IN_PERSON',
    status: 'SCHEDULED',
  },
];

export default function DoctorDashboard() {
  return (
    <div>
      <PageHeader
        title="Doctor Dashboard"
        description="Welcome back! Here is your schedule for today."
      />

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Appointments"
          value={5}
          icon={<CalendarDays className="h-6 w-6" />}
          trend={{ value: 2, label: 'vs yesterday' }}
        />
        <StatsCard
          title="This Week"
          value={23}
          icon={<CalendarCheck className="h-6 w-6" />}
          trend={{ value: 8, label: 'vs last week' }}
        />
        <StatsCard
          title="Total Patients"
          value={156}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 5.2, label: 'vs last month' }}
        />
        <StatsCard
          title="Avg Rating"
          value="4.8"
          icon={<Star className="h-6 w-6" />}
          trend={{ value: 0.2, label: 'vs last month' }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <Badge variant="default">{todaysAppointments.length} appointments</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                        <Clock className="h-4 w-4" />
                        <span className="mt-0.5 text-[10px] font-bold">{apt.time}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Avatar
                            fallback={getInitials(
                              apt.patientName.split(' ')[0],
                              apt.patientName.split(' ')[1],
                            )}
                            size="sm"
                          />
                          <p className="font-medium text-gray-900">{apt.patientName}</p>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">{apt.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        {consultationIcon[apt.type]}
                        <span className="text-xs">{apt.type.replace('_', ' ')}</span>
                      </div>
                      <Badge
                        variant={apt.status === 'CONFIRMED' ? 'success' : 'default'}
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <CalendarDays className="mr-2 h-4 w-4" /> View Full Schedule
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" /> My Patients
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" /> Manage Availability
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="mr-2 h-4 w-4" /> Write Prescription
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tomorrow</span>
                  <span className="font-medium">6 appointments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">This week remaining</span>
                  <span className="font-medium">18 appointments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pending reviews</span>
                  <span className="font-medium text-yellow-600">3 records</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
