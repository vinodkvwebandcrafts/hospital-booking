import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInstanceOf(HTMLButtonElement);
    });

    it('should forward ref to the button element', () => {
      const ref = { current: null } as React.RefObject<HTMLButtonElement>;
      render(<Button ref={ref}>Ref test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should spread additional HTML attributes', () => {
      render(<Button data-testid="custom-btn" aria-label="action">Go</Button>);
      expect(screen.getByTestId('custom-btn')).toBeInTheDocument();
      expect(screen.getByLabelText('action')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should apply default variant classes when no variant is specified', () => {
      render(<Button>Default</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-primary-600');
    });

    it('should apply destructive variant classes', () => {
      render(<Button variant="destructive">Delete</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-red-600');
    });

    it('should apply outline variant classes', () => {
      render(<Button variant="outline">Outline</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('border');
      expect(btn.className).toContain('bg-white');
    });

    it('should apply secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-gray-100');
    });

    it('should apply ghost variant classes', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('hover:bg-gray-100');
    });

    it('should apply link variant classes', () => {
      render(<Button variant="link">Link</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('text-primary-600');
      expect(btn.className).toContain('underline-offset-4');
    });
  });

  describe('sizes', () => {
    it('should apply default size classes', () => {
      render(<Button>Default size</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('h-10');
      expect(btn.className).toContain('px-4');
    });

    it('should apply sm size classes', () => {
      render(<Button size="sm">Small</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('h-8');
      expect(btn.className).toContain('text-xs');
    });

    it('should apply lg size classes', () => {
      render(<Button size="lg">Large</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('h-12');
      expect(btn.className).toContain('px-8');
    });

    it('should apply icon size classes', () => {
      render(<Button size="icon">X</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('h-10');
      expect(btn.className).toContain('w-10');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should apply disabled styling classes', () => {
      render(<Button disabled>Disabled</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('disabled:opacity-50');
    });

    it('should not fire onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('click handling', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom className', () => {
    it('should merge custom className with variant classes', () => {
      render(<Button className="my-custom-class">Custom</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('my-custom-class');
      // Should still have base classes
      expect(btn.className).toContain('inline-flex');
    });
  });

  describe('type attribute', () => {
    it('should accept type="submit"', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should accept type="button"', () => {
      render(<Button type="button">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });
});
