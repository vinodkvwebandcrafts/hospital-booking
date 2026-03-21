import React from 'react';
import { render, screen } from '@testing-library/react-native';
import StatusBadge from '../StatusBadge';
import { AppointmentStatus } from '@/types';

describe('StatusBadge', () => {
  it('should render "Scheduled" for SCHEDULED status', () => {
    render(<StatusBadge status={AppointmentStatus.SCHEDULED} />);
    expect(screen.getByText('Scheduled')).toBeTruthy();
  });

  it('should render "Confirmed" for CONFIRMED status', () => {
    render(<StatusBadge status={AppointmentStatus.CONFIRMED} />);
    expect(screen.getByText('Confirmed')).toBeTruthy();
  });

  it('should render "Completed" for COMPLETED status', () => {
    render(<StatusBadge status={AppointmentStatus.COMPLETED} />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('should render "Cancelled" for CANCELLED status', () => {
    render(<StatusBadge status={AppointmentStatus.CANCELLED} />);
    expect(screen.getByText('Cancelled')).toBeTruthy();
  });

  it('should render "No Show" for NO_SHOW status', () => {
    render(<StatusBadge status={AppointmentStatus.NO_SHOW} />);
    expect(screen.getByText('No Show')).toBeTruthy();
  });

  it('should render all five statuses without errors', () => {
    const statuses = Object.values(AppointmentStatus);
    expect(statuses).toHaveLength(5);

    statuses.forEach((status) => {
      const { unmount } = render(<StatusBadge status={status} />);
      unmount();
    });
  });

  it('should accept a style prop', () => {
    render(
      <StatusBadge
        status={AppointmentStatus.SCHEDULED}
        style={{ marginRight: 4 }}
      />,
    );
    expect(screen.getByText('Scheduled')).toBeTruthy();
  });
});
