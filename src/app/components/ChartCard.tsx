import { ReactNode } from 'react';
import { cn } from './ui/utils';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      <div className="mb-6">
        <h3 className="font-semibold mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
