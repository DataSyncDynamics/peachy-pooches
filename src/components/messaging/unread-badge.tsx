'use client';

import { cn } from '@/lib/utils';

interface UnreadBadgeProps {
  count: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UnreadBadge({ count, className, size = 'md' }: UnreadBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  const sizeClasses = {
    sm: 'h-4 min-w-4 text-[10px]',
    md: 'h-5 min-w-5 text-xs',
    lg: 'h-6 min-w-6 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground font-medium px-1',
        sizeClasses[size],
        className
      )}
    >
      {displayCount}
    </span>
  );
}
