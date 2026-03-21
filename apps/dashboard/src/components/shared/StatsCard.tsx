import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                {isPositiveTrend ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    isPositiveTrend ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  {isPositiveTrend ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-gray-400">{trend.label}</span>
              </div>
            )}
          </div>
          <div className="rounded-xl bg-primary-50 p-3 text-primary-600">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
