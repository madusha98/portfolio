'use client';

import { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const TRAIL_LENGTH = 12;
const TRAIL_FADE_DURATION = 150;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for touch device and reduced motion
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsVisible(!isTouchDevice && !prefersReducedMotion);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      setIsVisible(!isTouchDevice && !e.matches);
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', handleMotionChange);

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      // Keep trail at max length
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();

      // Filter out old points
      trailRef.current = trailRef.current.filter(
        (point) => now - point.timestamp < TRAIL_FADE_DURATION
      );

      // Draw trail
      trailRef.current.forEach((point, index) => {
        const age = now - point.timestamp;
        const opacity = 1 - age / TRAIL_FADE_DURATION;
        const size = 8 - (index / TRAIL_LENGTH) * 6;

        if (opacity > 0 && size > 0) {
          ctx.globalAlpha = opacity * 0.8;
          ctx.fillStyle = '#39ff14';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#39ff14';

          // Draw pixel square
          ctx.fillRect(
            point.x - size / 2,
            point.y - size / 2,
            size,
            size
          );
        }
      });

      // Draw main cursor glow
      if (trailRef.current.length > 0) {
        const latest = trailRef.current[trailRef.current.length - 1];
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#39ff14';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#39ff14';
        ctx.fillRect(latest.x - 4, latest.y - 4, 8, 8);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[10000]"
      aria-hidden="true"
    />
  );
}
