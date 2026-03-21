import { render, screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';

// Mock lucide-react icons used inside StatsCard
vi.mock('lucide-react', () => ({
  TrendingUp: (props: Record<string, unknown>) => <svg data-testid="trending-up" {...props} />,
  TrendingDown: (props: Record<string, unknown>) => <svg data-testid="trending-down" {...props} />,
}));

describe('StatsCard', () => {
  const mockIcon = <span data-testid="mock-icon">icon</span>;

  describe('basic rendering', () => {
    it('should render the title', () => {
      render(<StatsCard title="Total Patients" value={1500} icon={mockIcon} />);
      expect(screen.getByText('Total Patients')).toBeInTheDocument();
    });

    it('should render a numeric value', () => {
      render(<StatsCard title="Appointments" value={42} icon={mockIcon} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render a string value', () => {
      render(<StatsCard title="Revenue" value="$12,500" icon={mockIcon} />);
      expect(screen.getByText('$12,500')).toBeInTheDocument();
    });

    it('should render the icon', () => {
      render(<StatsCard title="Doctors" value={25} icon={mockIcon} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('without trend', () => {
    it('should not render trend indicators when trend is not provided', () => {
      render(<StatsCard title="Patients" value={100} icon={mockIcon} />);
      expect(screen.queryByTestId('trending-up')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trending-down')).not.toBeInTheDocument();
    });
  });

  describe('positive trend', () => {
    it('should render TrendingUp icon for positive trend value', () => {
      render(
        <StatsCard
          title="Patients"
          value={100}
          icon={mockIcon}
          trend={{ value: 12, label: 'vs last month' }}
        />,
      );
      expect(screen.getByTestId('trending-up')).toBeInTheDocument();
      expect(screen.queryByTestId('trending-down')).not.toBeInTheDocument();
    });

    it('should display positive trend value with + prefix', () => {
      render(
        <StatsCard
          title="Patients"
          value={100}
          icon={mockIcon}
          trend={{ value: 12, label: 'vs last month' }}
        />,
      );
      expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    it('should display the trend label', () => {
      render(
        <StatsCard
          title="Patients"
          value={100}
          icon={mockIcon}
          trend={{ value: 5, label: 'vs last week' }}
        />,
      );
      expect(screen.getByText('vs last week')).toBeInTheDocument();
    });

    it('should apply green color classes for positive trend', () => {
      render(
        <StatsCard
          title="Patients"
          value={100}
          icon={mockIcon}
          trend={{ value: 8, label: 'growth' }}
        />,
      );
      const trendValue = screen.getByText('+8%');
      expect(trendValue.className).toContain('text-green-600');
    });
  });

  describe('zero trend', () => {
    it('should treat zero as a positive trend (>= 0)', () => {
      render(
        <StatsCard
          title="Patients"
          value={100}
          icon={mockIcon}
          trend={{ value: 0, label: 'no change' }}
        />,
      );
      expect(screen.getByTestId('trending-up')).toBeInTheDocument();
    });
  });

  describe('negative trend', () => {
    it('should render TrendingDown icon for negative trend value', () => {
      render(
        <StatsCard
          title="Revenue"
          value="$10,000"
          icon={mockIcon}
          trend={{ value: -5, label: 'vs last month' }}
        />,
      );
      expect(screen.getByTestId('trending-down')).toBeInTheDocument();
      expect(screen.queryByTestId('trending-up')).not.toBeInTheDocument();
    });

    it('should display negative trend value without + prefix', () => {
      render(
        <StatsCard
          title="Revenue"
          value="$10,000"
          icon={mockIcon}
          trend={{ value: -5, label: 'vs last month' }}
        />,
      );
      expect(screen.getByText('-5%')).toBeInTheDocument();
    });

    it('should apply red color classes for negative trend', () => {
      render(
        <StatsCard
          title="Revenue"
          value="$10,000"
          icon={mockIcon}
          trend={{ value: -3, label: 'decline' }}
        />,
      );
      const trendValue = screen.getByText('-3%');
      expect(trendValue.className).toContain('text-red-600');
    });
  });

  describe('custom className', () => {
    it('should apply additional className to the card', () => {
      const { container } = render(
        <StatsCard title="Test" value={1} icon={mockIcon} className="custom-class" />,
      );
      // The outer Card element should receive the className
      const card = container.firstElementChild;
      expect(card?.className).toContain('custom-class');
    });
  });
});
