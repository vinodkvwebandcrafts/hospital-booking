import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render children text', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render as a div element', () => {
      render(<Badge data-testid="badge">Status</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.tagName).toBe('DIV');
    });

    it('should spread additional HTML attributes', () => {
      render(<Badge data-testid="my-badge" aria-label="status">OK</Badge>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
      expect(screen.getByLabelText('status')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should apply default variant classes when no variant is specified', () => {
      render(<Badge data-testid="badge">Default</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('bg-primary-100');
      expect(el.className).toContain('text-primary-800');
    });

    it('should apply secondary variant classes', () => {
      render(<Badge variant="secondary" data-testid="badge">Secondary</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('bg-gray-100');
      expect(el.className).toContain('text-gray-800');
    });

    it('should apply success variant classes', () => {
      render(<Badge variant="success" data-testid="badge">Success</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('bg-green-100');
      expect(el.className).toContain('text-green-800');
    });

    it('should apply warning variant classes', () => {
      render(<Badge variant="warning" data-testid="badge">Warning</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('bg-yellow-100');
      expect(el.className).toContain('text-yellow-800');
    });

    it('should apply destructive variant classes', () => {
      render(<Badge variant="destructive" data-testid="badge">Error</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('bg-red-100');
      expect(el.className).toContain('text-red-800');
    });

    it('should apply outline variant classes', () => {
      render(<Badge variant="outline" data-testid="badge">Outline</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('border-gray-300');
      expect(el.className).toContain('text-gray-700');
    });
  });

  describe('base styles', () => {
    it('should always include base classes regardless of variant', () => {
      render(<Badge data-testid="badge">Test</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('inline-flex');
      expect(el.className).toContain('rounded-full');
      expect(el.className).toContain('text-xs');
      expect(el.className).toContain('font-semibold');
    });
  });

  describe('custom className', () => {
    it('should merge custom className with variant classes', () => {
      render(<Badge className="ml-2" data-testid="badge">Custom</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.className).toContain('ml-2');
      // Should still have base classes
      expect(el.className).toContain('inline-flex');
    });
  });
});
