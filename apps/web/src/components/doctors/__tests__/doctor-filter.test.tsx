import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoctorFilter } from '../doctor-filter';

// Mock constants
vi.mock('@/lib/constants', () => ({
  SPECIALIZATIONS: ['Cardiology', 'Dermatology', 'Neurology'],
}));

const defaultProps = {
  search: '',
  onSearchChange: vi.fn(),
  specialization: '',
  onSpecializationChange: vi.fn(),
  availableOnly: false,
  onAvailableChange: vi.fn(),
};

describe('DoctorFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('search input', () => {
    it('should render search input with placeholder', () => {
      render(<DoctorFilter {...defaultProps} />);
      expect(
        screen.getByPlaceholderText(/search doctors by name/i),
      ).toBeInTheDocument();
    });

    it('should display current search value', () => {
      render(<DoctorFilter {...defaultProps} search="Dr. Smith" />);
      expect(screen.getByPlaceholderText(/search doctors by name/i)).toHaveValue(
        'Dr. Smith',
      );
    });

    it('should call onSearchChange when typing', async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();
      render(<DoctorFilter {...defaultProps} onSearchChange={onSearchChange} />);

      await user.type(screen.getByPlaceholderText(/search doctors by name/i), 'A');

      expect(onSearchChange).toHaveBeenCalledWith('A');
    });
  });

  describe('specialization select', () => {
    it('should render specialization options including "All Specialties"', () => {
      render(<DoctorFilter {...defaultProps} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      // Check that specializations are rendered as options
      expect(screen.getByText('All Specialties')).toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Dermatology')).toBeInTheDocument();
      expect(screen.getByText('Neurology')).toBeInTheDocument();
    });

    it('should call onSpecializationChange when selecting a specialty', async () => {
      const user = userEvent.setup();
      const onSpecializationChange = vi.fn();
      render(
        <DoctorFilter
          {...defaultProps}
          onSpecializationChange={onSpecializationChange}
        />,
      );

      await user.selectOptions(screen.getByRole('combobox'), 'Cardiology');
      expect(onSpecializationChange).toHaveBeenCalled();
    });
  });

  describe('availability toggle', () => {
    it('should render the "Available now" checkbox', () => {
      render(<DoctorFilter {...defaultProps} />);
      expect(screen.getByText(/available now/i)).toBeInTheDocument();
    });

    it('should reflect the availableOnly prop as checked state', () => {
      render(<DoctorFilter {...defaultProps} availableOnly={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should be unchecked when availableOnly is false', () => {
      render(<DoctorFilter {...defaultProps} availableOnly={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should call onAvailableChange when toggling', async () => {
      const user = userEvent.setup();
      const onAvailableChange = vi.fn();
      render(
        <DoctorFilter {...defaultProps} onAvailableChange={onAvailableChange} />,
      );

      await user.click(screen.getByRole('checkbox'));
      expect(onAvailableChange).toHaveBeenCalledWith(true);
    });
  });
});
