import React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={className} data-value={value} data-onchange={onValueChange as unknown}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<TabInternalProps>, {
            _activeValue: value,
            _onValueChange: onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabInternalProps {
  _activeValue?: string;
  _onValueChange?: (value: string) => void;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement>, TabInternalProps {}

function TabsList({ className, children, _activeValue, _onValueChange, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1',
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<TabInternalProps>, {
            _activeValue,
            _onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    TabInternalProps {
  value: string;
}

function TabsTrigger({
  className,
  value,
  _activeValue,
  _onValueChange,
  ...props
}: TabsTriggerProps) {
  const isActive = _activeValue === value;
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        isActive
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900',
        className,
      )}
      onClick={() => _onValueChange?.(value)}
      {...props}
    />
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement>, TabInternalProps {
  value: string;
}

function TabsContent({ className, value, _activeValue, _onValueChange: _, ...props }: TabsContentProps) {
  if (_activeValue !== value) return null;
  return <div className={cn('mt-4', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
