import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface DaySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface ScheduleFormProps {
  defaultSchedule?: DaySchedule[];
  onSubmit: (schedule: DaySchedule[]) => void;
  isLoading?: boolean;
}

const defaultDaySchedule: DaySchedule[] = DAYS.map((_, idx) => ({
  dayOfWeek: idx,
  startTime: '09:00',
  endTime: '17:00',
  isActive: idx < 5, // Mon-Fri active by default
}));

export function ScheduleForm({ defaultSchedule, onSubmit, isLoading }: ScheduleFormProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    defaultSchedule ?? defaultDaySchedule,
  );

  const toggleDay = (idx: number) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, isActive: !d.isActive } : d)),
    );
  };

  const updateTime = (idx: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(schedule);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {schedule.map((day, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-center gap-4 rounded-lg border p-4 transition-colors',
              day.isActive
                ? 'border-primary-200 bg-primary-50/30'
                : 'border-gray-200 bg-gray-50/50',
            )}
          >
            {/* Toggle */}
            <button
              type="button"
              onClick={() => toggleDay(idx)}
              className={cn(
                'flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
                day.isActive ? 'bg-primary-600' : 'bg-gray-300',
              )}
            >
              <span
                className={cn(
                  'h-5 w-5 rounded-full bg-white shadow transition-transform',
                  day.isActive ? 'translate-x-[22px]' : 'translate-x-0.5',
                )}
              />
            </button>

            {/* Day name */}
            <span
              className={cn(
                'w-24 text-sm font-medium',
                day.isActive ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              {DAYS[idx]}
            </span>

            {/* Time inputs */}
            {day.isActive ? (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => updateTime(idx, 'startTime', e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-gray-500">to</span>
                <Input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => updateTime(idx, 'endTime', e.target.value)}
                  className="w-32"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400">Day off</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>
    </form>
  );
}
