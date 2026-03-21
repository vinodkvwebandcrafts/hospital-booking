import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../DataTable';
import type { ColumnDef } from '@tanstack/react-table';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowUpDown: (props: Record<string, unknown>) => <svg data-testid="arrow-updown" {...props} />,
  ArrowUp: (props: Record<string, unknown>) => <svg data-testid="arrow-up" {...props} />,
  ArrowDown: (props: Record<string, unknown>) => <svg data-testid="arrow-down" {...props} />,
  ChevronLeft: (props: Record<string, unknown>) => <svg data-testid="chevron-left" {...props} />,
  ChevronRight: (props: Record<string, unknown>) => <svg data-testid="chevron-right" {...props} />,
}));

interface TestItem {
  id: number;
  name: string;
  age: number;
  email: string;
}

const testColumns: ColumnDef<TestItem, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];

function generateTestData(count: number): TestItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    age: 20 + i,
    email: `person${i + 1}@test.com`,
  }));
}

describe('DataTable', () => {
  describe('basic rendering', () => {
    it('should render column headers', () => {
      render(<DataTable columns={testColumns} data={generateTestData(3)} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render row data', () => {
      const data = generateTestData(3);
      render(<DataTable columns={testColumns} data={data} />);

      expect(screen.getByText('Person 1')).toBeInTheDocument();
      expect(screen.getByText('Person 2')).toBeInTheDocument();
      expect(screen.getByText('Person 3')).toBeInTheDocument();
    });

    it('should render all cell values in each row', () => {
      const data = [{ id: 1, name: 'Alice', age: 30, email: 'alice@test.com' }];
      render(<DataTable columns={testColumns} data={data} />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should display "No results found." when data is empty', () => {
      render(<DataTable columns={testColumns} data={[]} />);
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });

    it('should render column headers even when data is empty', () => {
      render(<DataTable columns={testColumns} data={[]} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('should render sort icons on sortable columns', () => {
      render(<DataTable columns={testColumns} data={generateTestData(3)} />);
      // By default, all columns with accessorKey are sortable
      const sortIcons = screen.getAllByTestId('arrow-updown');
      expect(sortIcons.length).toBeGreaterThan(0);
    });

    it('should sort ascending on first click of a column header', async () => {
      const data = [
        { id: 1, name: 'Charlie', age: 35, email: 'c@test.com' },
        { id: 2, name: 'Alice', age: 25, email: 'a@test.com' },
        { id: 3, name: 'Bob', age: 30, email: 'b@test.com' },
      ];
      render(<DataTable columns={testColumns} data={data} />);

      // Click the Name header to sort
      await userEvent.click(screen.getByText('Name'));

      // After sorting asc, the arrow-up icon should appear
      expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
    });

    it('should sort descending on second click of a column header', async () => {
      const data = [
        { id: 1, name: 'Charlie', age: 35, email: 'c@test.com' },
        { id: 2, name: 'Alice', age: 25, email: 'a@test.com' },
        { id: 3, name: 'Bob', age: 30, email: 'b@test.com' },
      ];
      render(<DataTable columns={testColumns} data={data} />);

      const nameHeader = screen.getByText('Name');
      await userEvent.click(nameHeader);
      await userEvent.click(nameHeader);

      expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    it('should not render pagination when all data fits on one page', () => {
      render(<DataTable columns={testColumns} data={generateTestData(5)} pageSize={10} />);
      // No "Showing X to Y" text when only 1 page
      expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });

    it('should render pagination when data exceeds page size', () => {
      render(<DataTable columns={testColumns} data={generateTestData(15)} pageSize={5} />);
      expect(screen.getByText(/Showing 1 to 5 of 15 results/)).toBeInTheDocument();
    });

    it('should only render pageSize rows per page', () => {
      const data = generateTestData(12);
      render(<DataTable columns={testColumns} data={data} pageSize={5} />);

      // Should only show first 5 persons
      expect(screen.getByText('Person 1')).toBeInTheDocument();
      expect(screen.getByText('Person 5')).toBeInTheDocument();
      expect(screen.queryByText('Person 6')).not.toBeInTheDocument();
    });

    it('should use default pageSize of 10', () => {
      const data = generateTestData(15);
      render(<DataTable columns={testColumns} data={data} />);

      expect(screen.getByText('Person 1')).toBeInTheDocument();
      expect(screen.getByText('Person 10')).toBeInTheDocument();
      expect(screen.queryByText('Person 11')).not.toBeInTheDocument();
    });
  });
});
