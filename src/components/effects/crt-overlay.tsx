'use client';

import { useEffect, useState } from 'react';

export function CRTOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsVisible(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Scan lines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.03),
            rgba(0, 0, 0, 0.03) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
        aria-hidden="true"
      />

      {/* Moving scan line */}
      <div
        className="crt-scanline"
        aria-hidden="true"
      />

      {/* Screen curvature effect (vignette) */}
      <div
        className="pointer-events-none fixed inset-0 z-[9996]"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
        }}
        aria-hidden="true"
      />
    </>
  );
}
