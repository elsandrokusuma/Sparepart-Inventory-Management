import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement | LucideIcon;
  description?: string;
  accentColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  accentColor = 'text-primary',
}: StatCardProps) {
  const IconComponent = icon as React.FC<any>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {React.isValidElement(icon) ? (
          icon
        ) : (
          <IconComponent className={`h-4 w-4 text-muted-foreground ${accentColor}`} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
