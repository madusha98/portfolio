'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 15,
  radius = 100,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

  useEffect(() => {
    if (isReducedMotion) return;

    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < radius) {
        // Calculate magnetic pull based on distance
        const pull = 1 - distance / radius;
        const moveX = (distanceX / radius) * strength * pull;
        const moveY = (distanceY / radius) * strength * pull;

        setPosition({ x: moveX, y: moveY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isReducedMotion, radius, strength]);

  return (
    <div
      ref={buttonRef}
      className={cn('magnetic-button inline-block', className)}
      style={{
        transform: isReducedMotion
          ? 'none'
          : `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0
          ? 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)'
          : 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
}
