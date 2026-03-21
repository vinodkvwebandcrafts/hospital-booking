import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('should render children text', () => {
      render(<Badge>Status</Badge>);
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render as a div element', () => {
      render(<Badge>Status</Badge>);
      expect(screen.getByText('Status').tagName).toBe('DIV');
    });
  });

  describe('variants', () => {
    it('should apply default variant classes', () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge.className).toContain('bg-primary-100');
      expect(badge.className).toContain('text-primary-800');
    });

    it('should apply secondary variant classes', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText('Secondary');
      expect(badge.className).toContain('bg-gray-100');
      expect(badge.className).toContain('text-gray-800');
    });

    it('should apply destructive variant classes', () => {
      render(<Badge variant="destructive">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge.className).toContain('bg-red-100');
      expect(badge.className).toContain('text-red-800');
    });

    it('should apply outline variant classes', () => {
      render(<Badge variant="outline">Outline</Badge>);
      const badge = screen.getByText('Outline');
      expect(badge.className).toContain('border');
      expect(badge.className).toContain('text-gray-700');
    });

    it('should apply success variant classes', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge.className).toContain('bg-green-100');
      expect(badge.className).toContain('text-green-800');
    });

    it('should apply warning variant classes', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge.className).toContain('bg-yellow-100');
      expect(badge.className).toContain('text-yellow-800');
    });

    it('should use default variant when no variant is specified', () => {
      render(<Badge>No variant</Badge>);
      const badge = screen.getByText('No variant');
      expect(badge.className).toContain('bg-primary-100');
    });
  });

  describe('custom className', () => {
    it('should merge custom className with variant classes', () => {
      render(<Badge className="extra-class">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge.className).toContain('extra-class');
      // Should still have base classes
      expect(badge.className).toContain('inline-flex');
    });
  });

  describe('HTML attributes', () => {
    it('should pass through additional HTML attributes', () => {
      render(<Badge data-testid="my-badge">Test</Badge>);
      expect(screen.getByTestId('my-badge')).toBeInTheDocument();
    });
  });
});
