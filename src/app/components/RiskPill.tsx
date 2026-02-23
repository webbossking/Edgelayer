import { cn } from './ui/utils';

export type RiskLevel = 'low' | 'medium' | 'high';

interface RiskPillProps {
  risk: RiskLevel;
  className?: string;
}

export function RiskPill({ risk, className }: RiskPillProps) {
  const variants = {
    low: 'bg-[#d1fae5] text-[#10b981] dark:bg-[#064e3b] dark:text-[#34d399]',
    medium: 'bg-[#fef3c7] text-[#f59e0b] dark:bg-[#78350f] dark:text-[#fbbf24]',
    high: 'bg-[#fee2e2] text-[#ef4444] dark:bg-[#7f1d1d] dark:text-[#f87171]'
  };

  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        variants[risk],
        className
      )}
    >
      {labels[risk]}
    </span>
  );
}
