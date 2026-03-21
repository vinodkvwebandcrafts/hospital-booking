import { PageHeader } from '@/components/shared/PageHeader';
import { ScheduleForm } from '@/components/forms/ScheduleForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Mock current schedule
const currentSchedule = [
  { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isActive: true },
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true },
  { dayOfWeek: 2, startTime: '10:00', endTime: '18:00', isActive: true },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true },
  { dayOfWeek: 4, startTime: '09:00', endTime: '15:00', isActive: true },
  { dayOfWeek: 5, startTime: '10:00', endTime: '13:00', isActive: true },
  { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isActive: false },
];

export default function Schedule() {
  const handleSubmit = (schedule: typeof currentSchedule) => {
    console.log('Schedule saved:', schedule);
    toast.success('Schedule updated successfully');
  };

  return (
    <div>
      <PageHeader
        title="Schedule Management"
        description="Set your weekly availability and working hours"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleForm
                defaultSchedule={currentSchedule}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Current Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentSchedule.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <span className="text-sm font-medium text-gray-700">{DAYS[idx]}</span>
                    {day.isActive ? (
                      <Badge variant="success" className="text-xs">
                        {day.startTime} - {day.endTime}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Day off
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Schedule Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>
                Your schedule determines when patients can book appointments with you.
              </p>
              <p>
                Changes to your schedule will not affect existing appointments but will
                update available time slots for new bookings.
              </p>
              <p className="text-xs text-gray-400">
                Appointment duration: 30 minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
