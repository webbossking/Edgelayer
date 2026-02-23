import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
}: SlideInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 40 };
      case 'down':
        return { y: -40 };
      case 'left':
        return { x: 40 };
      case 'right':
        return { x: -40 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function ScaleIn({ children, delay = 0, duration = 0.4 }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
}

export function StaggerChildren({ children, staggerDelay = 0.1 }: StaggerChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
}

export function StaggerItem({ children }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
    transition: { duration: 0.3 },
  },
};

// Counter animation
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  decimals = 0,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </motion.span>
    </motion.span>
  );
}

// Progress bar animation
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function AnimatedProgress({ value, max = 100, className = '' }: AnimatedProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full bg-muted rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}
