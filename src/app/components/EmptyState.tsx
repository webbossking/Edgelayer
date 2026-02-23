import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { BrandButton } from './BrandButton';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 p-4 rounded-full bg-muted/50">
          <Icon className="size-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>}
      {action && (
        <BrandButton onClick={action.onClick} variant="primary">
          {action.label}
        </BrandButton>
      )}
    </div>
  );
}
