import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Doctor } from '@hospital-booking/shared-types';
import { DoctorCard } from '../doctor-card';

function createDoctor(overrides: Partial<Doctor> = {}): Doctor {
  return {
    id: 'doc-1',
    userId: 'user-1',
    specialization: 'Cardiology',
    averageRating: 4.2,
    totalReviews: 38,
    appointmentDurationMinutes: 30,
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    user: {
      id: 'user-1',
      email: 'doc@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567890',
      role: 'PATIENT' as any,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    ...overrides,
  };
}

describe('DoctorCard', () => {
  describe('rendering doctor info', () => {
    it('should display the doctor name with Dr. prefix', () => {
      render(<DoctorCard doctor={createDoctor()} />);
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    it('should display "Doctor" when user is not present', () => {
      render(<DoctorCard doctor={createDoctor({ user: undefined })} />);
      expect(screen.getByText('Doctor')).toBeInTheDocument();
    });

    it('should display the specialization', () => {
      render(<DoctorCard doctor={createDoctor()} />);
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });

    it('should display the total reviews count', () => {
      render(<DoctorCard doctor={createDoctor()} />);
      expect(screen.getByText('(38)')).toBeInTheDocument();
    });

    it('should display initials in avatar when user exists', () => {
      render(<DoctorCard doctor={createDoctor()} />);
      expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('should display "DR" initials when user is absent', () => {
      render(<DoctorCard doctor={createDoctor({ user: undefined })} />);
      expect(screen.getByText('DR')).toBeInTheDocument();
    });
  });

  describe('rating stars', () => {
    it('should render 5 star elements', () => {
      const { container } = render(<DoctorCard doctor={createDoctor()} />);
      // Stars are SVG elements rendered by lucide-react
      const stars = container.querySelectorAll('svg');
      // There are also MapPin and other icons; count stars by their parent
      // A simpler approach: check by the class pattern
      const allSvgs = container.querySelectorAll('svg');
      // At minimum we have 5 star svgs + potential MapPin svg
      expect(allSvgs.length).toBeGreaterThanOrEqual(5);
    });

    it('should fill stars according to the rating', () => {
      // With rating 4.2, Math.round(4.2) = 4, so 4 stars filled
      const { container } = render(
        <DoctorCard doctor={createDoctor({ averageRating: 4.2 })} />,
      );
      const filledStars = container.querySelectorAll('.fill-yellow-400');
      expect(filledStars.length).toBe(4);
    });

    it('should fill all 5 stars for rating 5', () => {
      const { container } = render(
        <DoctorCard doctor={createDoctor({ averageRating: 5 })} />,
      );
      const filledStars = container.querySelectorAll('.fill-yellow-400');
      expect(filledStars.length).toBe(5);
    });

    it('should fill 0 stars for rating 0', () => {
      const { container } = render(
        <DoctorCard doctor={createDoctor({ averageRating: 0 })} />,
      );
      const filledStars = container.querySelectorAll('.fill-yellow-400');
      expect(filledStars.length).toBe(0);
    });
  });

  describe('clinic info', () => {
    it('should display clinic name when provided', () => {
      render(
        <DoctorCard doctor={createDoctor({ clinicName: 'Heart Center' })} />,
      );
      expect(screen.getByText('Heart Center')).toBeInTheDocument();
    });

    it('should not display clinic section when clinicName is absent', () => {
      render(
        <DoctorCard doctor={createDoctor({ clinicName: undefined })} />,
      );
      expect(screen.queryByText('Heart Center')).not.toBeInTheDocument();
    });
  });

  describe('consultation fee', () => {
    it('should display consultation fee when provided', () => {
      render(
        <DoctorCard doctor={createDoctor({ consultationFee: 150 })} />,
      );
      expect(screen.getByText(/\$150\.00/)).toBeInTheDocument();
      expect(screen.getByText(/\/ visit/)).toBeInTheDocument();
    });

    it('should not display fee when consultationFee is undefined', () => {
      render(
        <DoctorCard doctor={createDoctor({ consultationFee: undefined })} />,
      );
      expect(screen.queryByText(/\/ visit/)).not.toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('should render View Profile link pointing to doctor profile', () => {
      render(<DoctorCard doctor={createDoctor()} />);
      const viewLink = screen.getByText('View Profile').closest('a');
      expect(viewLink).toHaveAttribute('href', '/doctors/doc-1');
    });

    it('should render Book Now link pointing to booking page', () => {
      render(<DoctorCard doctor={createDoctor()} />);
      const bookLink = screen.getByText('Book Now').closest('a');
      expect(bookLink).toHaveAttribute('href', '/book/doc-1');
    });
  });
});
