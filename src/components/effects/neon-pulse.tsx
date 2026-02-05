'use client';

import { useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonPulseProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?: 'box' | 'text';
}

export function NeonPulse({
  children,
  className,
  delay = 0,
  type = 'box',
}: NeonPulseProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const delayClass =
    delay === 0 ? '' :
    delay <= 0.3 ? 'neon-glow-delay-1' :
    delay <= 0.6 ? 'neon-glow-delay-2' :
    delay <= 0.9 ? 'neon-glow-delay-3' :
    'neon-glow-delay-4';

  return (
    <div
      className={cn(
        !isReducedMotion && (type === 'box' ? 'neon-glow' : 'neon-glow-text'),
        !isReducedMotion && delayClass,
        className
      )}
      style={delay > 0 && !delayClass ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
