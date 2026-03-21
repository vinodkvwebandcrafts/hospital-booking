import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TimeSlot } from '@hospital-booking/shared-types';
import { TimeSlotSelector } from '../time-slot-selector';

function createSlot(overrides: Partial<TimeSlot> = {}): TimeSlot {
  return {
    startTime: '09:00',
    endTime: '09:30',
    isAvailable: true,
    isLocked: false,
    ...overrides,
  };
}

describe('TimeSlotSelector', () => {
  describe('empty state', () => {
    it('should display empty message when no slots are provided', () => {
      render(
        <TimeSlotSelector
          slots={[]}
          selectedSlot={null}
          onSelectSlot={vi.fn()}
        />,
      );
      expect(
        screen.getByText(/no time slots available for this date/i),
      ).toBeInTheDocument();
    });
  });

  describe('rendering slots', () => {
    it('should render all provided slots', () => {
      const slots = [
        createSlot({ startTime: '09:00', endTime: '09:30' }),
        createSlot({ startTime: '10:00', endTime: '10:30' }),
        createSlot({ startTime: '11:00', endTime: '11:30' }),
      ];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={vi.fn()}
        />,
      );
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('10:00')).toBeInTheDocument();
      expect(screen.getByText('11:00')).toBeInTheDocument();
    });

    it('should render available slot with green styling', () => {
      const slots = [createSlot({ startTime: '09:00', isAvailable: true, isLocked: false })];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={vi.fn()}
        />,
      );
      const button = screen.getByText('09:00');
      expect(button.className).toContain('bg-green-50');
      expect(button).not.toBeDisabled();
    });

    it('should render booked (unavailable) slot with gray styling and disabled', () => {
      const slots = [
        createSlot({ startTime: '09:00', isAvailable: false, isLocked: false }),
      ];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={vi.fn()}
        />,
      );
      const button = screen.getByText('09:00');
      expect(button.className).toContain('bg-gray-100');
      expect(button).toBeDisabled();
    });

    it('should render locked slot with yellow styling and disabled', () => {
      const slots = [
        createSlot({ startTime: '09:00', isAvailable: false, isLocked: true }),
      ];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={vi.fn()}
        />,
      );
      const button = screen.getByText('09:00');
      expect(button.className).toContain('bg-yellow-50');
      expect(button).toBeDisabled();
    });

    it('should render selected slot with primary styling', () => {
      const slots = [createSlot({ startTime: '09:00' })];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot="09:00"
          onSelectSlot={vi.fn()}
        />,
      );
      const button = screen.getByText('09:00');
      expect(button.className).toContain('bg-primary-600');
      expect(button.className).toContain('text-white');
    });
  });

  describe('slot interaction', () => {
    it('should call onSelectSlot when an available slot is clicked', async () => {
      const user = userEvent.setup();
      const onSelectSlot = vi.fn();
      const slots = [createSlot({ startTime: '09:00' })];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={onSelectSlot}
        />,
      );

      await user.click(screen.getByText('09:00'));
      expect(onSelectSlot).toHaveBeenCalledWith('09:00');
    });

    it('should not call onSelectSlot when a booked slot is clicked', async () => {
      const user = userEvent.setup();
      const onSelectSlot = vi.fn();
      const slots = [
        createSlot({ startTime: '09:00', isAvailable: false, isLocked: false }),
      ];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={onSelectSlot}
        />,
      );

      await user.click(screen.getByText('09:00'));
      expect(onSelectSlot).not.toHaveBeenCalled();
    });

    it('should not call onSelectSlot when a locked slot is clicked', async () => {
      const user = userEvent.setup();
      const onSelectSlot = vi.fn();
      const slots = [
        createSlot({ startTime: '09:00', isAvailable: true, isLocked: true }),
      ];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={onSelectSlot}
        />,
      );

      await user.click(screen.getByText('09:00'));
      expect(onSelectSlot).not.toHaveBeenCalled();
    });
  });

  describe('mixed slots', () => {
    it('should correctly render a mix of available, booked, and locked slots', () => {
      const slots = [
        createSlot({ startTime: '09:00', isAvailable: true, isLocked: false }),
        createSlot({ startTime: '10:00', isAvailable: false, isLocked: false }),
        createSlot({ startTime: '11:00', isAvailable: false, isLocked: true }),
      ];
      render(
        <TimeSlotSelector
          slots={slots}
          selectedSlot={null}
          onSelectSlot={vi.fn()}
        />,
      );

      // Available
      expect(screen.getByText('09:00')).not.toBeDisabled();
      // Booked
      expect(screen.getByText('10:00')).toBeDisabled();
      // Locked
      expect(screen.getByText('11:00')).toBeDisabled();
    });
  });
});
