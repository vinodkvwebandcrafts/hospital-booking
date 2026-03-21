import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AppointmentStatus,
  ConsultationType,
  type Appointment,
} from '@hospital-booking/shared-types';
import { AppointmentCard } from '../appointment-card';

// Mock constants
vi.mock('@/lib/constants', () => ({
  CONSULTATION_TYPES: {
    IN_PERSON: { label: 'In Person', icon: 'building' },
    VIDEO_CALL: { label: 'Video Call', icon: 'video' },
    PHONE: { label: 'Phone', icon: 'phone' },
  },
}));

function createAppointment(
  overrides: Partial<Appointment> = {},
): Appointment {
  return {
    id: 'apt-1',
    doctorId: 'doc-1',
    patientId: 'pat-1',
    appointmentDateTime: '2025-03-15T10:00:00Z',
    durationMinutes: 30,
    status: AppointmentStatus.SCHEDULED,
    consultationType: ConsultationType.IN_PERSON,
    reminderSent: false,
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
    doctor: {
      id: 'doc-1',
      userId: 'user-1',
      specialization: 'Cardiology',
      averageRating: 4.5,
      totalReviews: 20,
      appointmentDurationMinutes: 30,
      isAvailable: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      user: {
        id: 'user-1',
        email: 'doc@example.com',
        firstName: 'Alice',
        lastName: 'Williams',
        phone: '+1234567890',
        role: 'DOCTOR' as any,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    },
    ...overrides,
  };
}

describe('AppointmentCard', () => {
  describe('rendering', () => {
    it('should display doctor name with Dr. prefix', () => {
      render(<AppointmentCard appointment={createAppointment()} />);
      expect(screen.getByText('Dr. Alice Williams')).toBeInTheDocument();
    });

    it('should display "Doctor" when doctor user is absent', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({ doctor: undefined })}
        />,
      );
      expect(screen.getByText('Doctor')).toBeInTheDocument();
    });

    it('should display the specialization', () => {
      render(<AppointmentCard appointment={createAppointment()} />);
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });

    it('should display formatted date', () => {
      render(<AppointmentCard appointment={createAppointment()} />);
      expect(screen.getByText('Mar 15, 2025')).toBeInTheDocument();
    });

    it('should display formatted time', () => {
      render(<AppointmentCard appointment={createAppointment()} />);
      expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    });

    it('should display consultation type label', () => {
      render(<AppointmentCard appointment={createAppointment()} />);
      expect(screen.getByText('In Person')).toBeInTheDocument();
    });

    it('should display reason when provided', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({ reason: 'Chest pain' })}
        />,
      );
      expect(screen.getByText('Chest pain')).toBeInTheDocument();
    });

    it('should not display reason when not provided', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({ reason: undefined })}
        />,
      );
      expect(screen.queryByText('Chest pain')).not.toBeInTheDocument();
    });
  });

  describe('status badge', () => {
    it('should display SCHEDULED status', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.SCHEDULED,
          })}
        />,
      );
      expect(screen.getByText('SCHEDULED')).toBeInTheDocument();
    });

    it('should display CONFIRMED status', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.CONFIRMED,
          })}
        />,
      );
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });

    it('should display COMPLETED status', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.COMPLETED,
          })}
        />,
      );
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    });

    it('should display CANCELLED status', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.CANCELLED,
          })}
        />,
      );
      expect(screen.getByText('CANCELLED')).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('should always render View Details link', () => {
      render(<AppointmentCard appointment={createAppointment()} />);
      const link = screen.getByText('View Details').closest('a');
      expect(link).toHaveAttribute('href', '/appointments/apt-1');
    });

    it('should render Cancel button for SCHEDULED appointments when onCancel is provided', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.SCHEDULED,
          })}
          onCancel={vi.fn()}
        />,
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render Cancel button for CONFIRMED appointments when onCancel is provided', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.CONFIRMED,
          })}
          onCancel={vi.fn()}
        />,
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should not render Cancel button for COMPLETED appointments', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.COMPLETED,
          })}
          onCancel={vi.fn()}
        />,
      );
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('should not render Cancel button for CANCELLED appointments', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.CANCELLED,
          })}
          onCancel={vi.fn()}
        />,
      );
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('should not render Cancel button when onCancel is not provided', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.SCHEDULED,
          })}
        />,
      );
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('should call onCancel with appointment id when Cancel is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(
        <AppointmentCard
          appointment={createAppointment({
            status: AppointmentStatus.SCHEDULED,
          })}
          onCancel={onCancel}
        />,
      );

      await user.click(screen.getByText('Cancel'));
      expect(onCancel).toHaveBeenCalledWith('apt-1');
    });
  });

  describe('consultation types', () => {
    it('should display Video Call label for VIDEO_CALL type', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            consultationType: ConsultationType.VIDEO_CALL,
          })}
        />,
      );
      expect(screen.getByText('Video Call')).toBeInTheDocument();
    });

    it('should display Phone label for PHONE type', () => {
      render(
        <AppointmentCard
          appointment={createAppointment({
            consultationType: ConsultationType.PHONE,
          })}
        />,
      );
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });
  });
});
