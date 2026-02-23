import { cn } from './ui/utils';

export type BetStatus = 'pending' | 'won' | 'lost' | 'void' | 'cashout';

interface StatusBadgeProps {
  status: BetStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    pending: 'bg-[#dbeafe] text-[#3b82f6] dark:bg-[#1e3a8a] dark:text-[#60a5fa]',
    won: 'bg-[#d1fae5] text-[#10b981] dark:bg-[#064e3b] dark:text-[#34d399]',
    lost: 'bg-[#fee2e2] text-[#ef4444] dark:bg-[#7f1d1d] dark:text-[#f87171]',
    void: 'bg-muted text-muted-foreground',
    cashout: 'bg-[#fef3c7] text-[#f59e0b] dark:bg-[#78350f] dark:text-[#fbbf24]'
  };

  const labels = {
    pending: 'Pending',
    won: 'Won',
    lost: 'Lost',
    void: 'Void',
    cashout: 'Cashed Out'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium',
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
