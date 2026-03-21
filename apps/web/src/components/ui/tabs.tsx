'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({ value: '', onValueChange: () => {} });

function useTabsContext() {
  return React.useContext(TabsContext);
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-lg bg-gray-100 p-1',
        className,
      )}
      role="tablist"
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700',
        className,
      )}
      onClick={() => ctx.onValueChange(value)}
      {...props}
    />
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = useTabsContext();
  if (ctx.value !== value) return null;

  return <div className={cn('mt-4 animate-fade-in', className)} role="tabpanel" {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
