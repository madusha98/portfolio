'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  glitchOnHover?: boolean;
  randomGlitch?: boolean;
  minInterval?: number;
  maxInterval?: number;
}

export function GlitchText({
  children,
  className,
  glitchOnHover = true,
  randomGlitch = true,
  minInterval = 5000,
  maxInterval = 10000,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion || !randomGlitch) return;

    const triggerRandomGlitch = () => {
      const delay = Math.random() * (maxInterval - minInterval) + minInterval;

      timeoutRef.current = setTimeout(() => {
        setIsGlitching(true);

        // Glitch duration: 200-500ms
        const glitchDuration = Math.random() * 300 + 200;
        setTimeout(() => {
          setIsGlitching(false);
        }, glitchDuration);

        triggerRandomGlitch();
      }, delay);
    };

    triggerRandomGlitch();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isReducedMotion, randomGlitch, minInterval, maxInterval]);

  const handleMouseEnter = () => {
    if (!isReducedMotion && glitchOnHover) {
      setIsGlitching(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isReducedMotion && glitchOnHover) {
      setTimeout(() => setIsGlitching(false), 300);
    }
  };

  const text = typeof children === 'string' ? children : '';

  return (
    <span
      className={cn(
        'glitch-text',
        isGlitching && 'glitching',
        className
      )}
      data-text={text}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </span>
  );
}
