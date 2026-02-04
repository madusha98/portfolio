'use client';

import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RGBSplitProps {
  children: ReactNode;
  className?: string;
  offset?: number;
  onHover?: boolean;
}

export function RGBSplit({
  children,
  className,
  offset = 3,
  onHover = true,
}: RGBSplitProps) {
  const [isHovered, setIsHovered] = useState(false);
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

  const showEffect = onHover ? isHovered && !isReducedMotion : !isReducedMotion;

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Red channel (shifted left) */}
      {showEffect && (
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            transform: `translateX(-${offset}px)`,
            filter: 'url(#red-channel)',
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        >
          {children}
        </div>
      )}

      {/* Blue channel (shifted right) */}
      {showEffect && (
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            transform: `translateX(${offset}px)`,
            filter: 'url(#blue-channel)',
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        >
          {children}
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          'relative transition-all duration-150',
          showEffect && 'opacity-90'
        )}
      >
        {children}
      </div>

      {/* SVG Filters for color channels */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="red-channel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="blue-channel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
