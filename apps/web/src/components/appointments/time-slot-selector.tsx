'use client';

import type { TimeSlot } from '@hospital-booking/shared-types';
import { cn } from '@/lib/utils';

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (startTime: string) => void;
}

export function TimeSlotSelector({ slots, selectedSlot, onSelectSlot }: TimeSlotSelectorProps) {
  if (slots.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        No time slots available for this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot.startTime;
        const isAvailable = slot.isAvailable && !slot.isLocked;
        const isLocked = slot.isLocked;

        return (
          <button
            key={slot.startTime}
            onClick={() => isAvailable && onSelectSlot(slot.startTime)}
            disabled={!isAvailable}
            className={cn(
              'rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
              isSelected
                ? 'border-primary-600 bg-primary-600 text-white'
                : isAvailable
                  ? 'border-green-300 bg-green-50 text-green-700 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700'
                  : isLocked
                    ? 'cursor-not-allowed border-yellow-300 bg-yellow-50 text-yellow-600'
                    : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400',
            )}
          >
            {slot.startTime}
          </button>
        );
      })}
    </div>
  );
}
