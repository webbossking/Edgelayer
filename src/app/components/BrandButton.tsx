import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from './ui/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-sm dark:bg-[#818cf8] dark:hover:bg-[#6366f1]',
        secondary:
          'bg-muted hover:bg-muted/80 text-foreground border border-border',
        ghost: 'hover:bg-muted text-foreground',
        danger: 'bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-sm'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface BrandButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const BrandButton = forwardRef<HTMLButtonElement, BrandButtonProps>(
  ({ variant, size, loading = false, disabled = false, className, children, type = 'button', ...props }, ref) => {
    const MotionButton = motion.button;

    return (
      <MotionButton
        ref={ref}
        whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </MotionButton>
    );
  }
);

BrandButton.displayName = 'BrandButton';
