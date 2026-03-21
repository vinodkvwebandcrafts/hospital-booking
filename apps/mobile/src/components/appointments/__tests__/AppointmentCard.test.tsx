import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AppointmentCard from '../AppointmentCard';
import { AppointmentStatus, ConsultationType } from '@/types';
import type { Appointment } from '@/types';

const baseAppointment: Appointment = {
  id: 'apt-1',
  doctorId: 'doc-1',
  patientId: 'pat-1',
  appointmentDateTime: '2025-06-15T10:30:00.000Z',
  durationMinutes: 30,
  status: AppointmentStatus.SCHEDULED,
  reason: 'Annual checkup',
  consultationType: ConsultationType.IN_PERSON,
  reminderSent: false,
  createdAt: '2025-06-01T00:00:00.000Z',
  updatedAt: '2025-06-01T00:00:00.000Z',
  patient: {
    id: 'pat-1',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '555-1234',
    role: 'PATIENT' as any,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  doctor: {
    id: 'doc-1',
    userId: 'user-doc-1',
    specialization: 'General',
    qualifications: [],
    experienceYears: 10,
    consultationFee: 100,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    user: {
      id: 'user-doc-1',
      email: 'doc@example.com',
      firstName: 'Robert',
      lastName: 'Brown',
      phone: '555-5678',
      role: 'DOCTOR' as any,
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  } as any,
};

describe('AppointmentCard', () => {
  it('should render patient name by default', () => {
    render(<AppointmentCard appointment={baseAppointment} />);
    expect(screen.getByText('Jane Smith')).toBeTruthy();
  });

  it('should render doctor name when showDoctor is true', () => {
    render(<AppointmentCard appointment={baseAppointment} showDoctor />);
    expect(screen.getByText('Robert Brown')).toBeTruthy();
  });

  it('should render formatted date', () => {
    render(<AppointmentCard appointment={baseAppointment} />);
    // date-fns format 'MMM d, yyyy' => 'Jun 15, 2025'
    expect(screen.getByText(/Jun 15, 2025/)).toBeTruthy();
  });

  it('should render formatted time', () => {
    render(<AppointmentCard appointment={baseAppointment} />);
    expect(screen.getByText(/10:30 AM/)).toBeTruthy();
  });

  it('should render the reason when provided', () => {
    render(<AppointmentCard appointment={baseAppointment} />);
    expect(screen.getByText('Annual checkup')).toBeTruthy();
  });

  it('should not render reason when not provided', () => {
    const noReason = { ...baseAppointment, reason: undefined };
    render(<AppointmentCard appointment={noReason} />);
    expect(screen.queryByText('Annual checkup')).toBeNull();
  });

  it('should render the status badge', () => {
    render(<AppointmentCard appointment={baseAppointment} />);
    expect(screen.getByText('Scheduled')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    render(<AppointmentCard appointment={baseAppointment} onPress={onPress} />);
    fireEvent.press(screen.getByText('Jane Smith'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should show "Unknown" when patient is missing', () => {
    const noPatient = { ...baseAppointment, patient: undefined };
    render(<AppointmentCard appointment={noPatient} />);
    expect(screen.getByText('Unknown')).toBeTruthy();
  });

  it('should render avatar initials from patient name', () => {
    render(<AppointmentCard appointment={baseAppointment} />);
    expect(screen.getByText('JS')).toBeTruthy();
  });
});
