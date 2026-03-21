import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should apply default variant classes', () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-primary-600');
    });

    it('should apply destructive variant classes', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-red-600');
    });

    it('should apply outline variant classes', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('border');
      expect(button.className).toContain('bg-white');
    });

    it('should apply secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gray-100');
    });

    it('should apply ghost variant classes', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('text-gray-700');
    });

    it('should apply link variant classes', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('text-primary-600');
      expect(button.className).toContain('underline-offset-4');
    });
  });

  describe('sizes', () => {
    it('should apply default size classes', () => {
      render(<Button size="default">Default</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-10');
      expect(button.className).toContain('px-4');
    });

    it('should apply sm size classes', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-8');
      expect(button.className).toContain('px-3');
    });

    it('should apply lg size classes', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-12');
      expect(button.className).toContain('px-6');
    });

    it('should apply icon size classes', () => {
      render(<Button size="icon">X</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-10');
      expect(button.className).toContain('w-10');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not fire onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should be disabled when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should render a spinner SVG when isLoading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.classList.contains('animate-spin')).toBe(true);
    });

    it('should still render children alongside spinner when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Loading');
    });

    it('should not render spinner when isLoading is false', () => {
      render(<Button isLoading={false}>Not Loading</Button>);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeNull();
    });
  });

  describe('interaction', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should forward ref', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Ref</Button>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });

  describe('custom className', () => {
    it('should merge custom className with variant classes', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });
  });

  describe('HTML attributes', () => {
    it('should forward type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });
});
