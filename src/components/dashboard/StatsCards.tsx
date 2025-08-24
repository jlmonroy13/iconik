'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export interface DashboardStatCard {
  title: string;
  value: string | number;
  description?: string;
}

interface StatsCardsProps {
  stats: DashboardStatCard[];
  className?: string;
}

export function StatsCards({ stats, className = '' }: StatsCardsProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${className}`}
    >
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
