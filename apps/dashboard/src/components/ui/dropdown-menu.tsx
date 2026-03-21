import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

function DropdownMenu({ trigger, children, align = 'right', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

function DropdownItem({ className, destructive, ...props }: DropdownItemProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50',
        destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700',
        className,
      )}
      {...props}
    />
  );
}

function DropdownSeparator() {
  return <div className="my-1 h-px bg-gray-200" />;
}

export { DropdownMenu, DropdownItem, DropdownSeparator };
