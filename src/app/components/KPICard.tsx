import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from './ui/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  tooltip?: string;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  prefix = '',
  suffix = '',
  trend,
  className,
  tooltip
}: KPICardProps) {
  const getTrendColor = () => {
    if (!trend) return '';
    if (trend === 'up') return 'text-[#10b981] dark:text-[#34d399]';
    if (trend === 'down') return 'text-[#ef4444] dark:text-[#f87171]';
    return 'text-muted-foreground';
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'bg-card border border-border rounded-lg p-6 transition-all hover:shadow-lg hover:border-[#6366f1]/20',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-semibold tracking-tight"
          >
            {prefix}
            {value}
            {suffix}
          </motion.p>
          {change !== undefined && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={cn('text-sm mt-2', getTrendColor())}
            >
              {change > 0 ? '+' : ''}
              {change}%
            </motion.p>
          )}
        </div>
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="bg-muted/50 p-3 rounded-lg"
          >
            <Icon className="size-5 text-muted-foreground" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}
