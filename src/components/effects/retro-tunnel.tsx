'use client';

import { useEffect, useRef, useState } from 'react';

interface Ring {
  z: number;
  rotation: number;
}

export function RetroTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const ringsRef = useRef<Ring[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsVisible(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / width,
        y: e.clientY / height,
      };
    };

    // Initialize rings
    const ringCount = 40;
    const maxZ = 1500;
    ringsRef.current = [];
    for (let i = 0; i < ringCount; i++) {
      ringsRef.current.push({
        z: (i / ringCount) * maxZ,
        rotation: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      // Smooth mouse following
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // Clear with fade trail
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Calculate tunnel center based on mouse
      const centerX = width / 2 + (mouseRef.current.x - 0.5) * 300;
      const centerY = height / 2 + (mouseRef.current.y - 0.5) * 200;

      // Sort rings by Z (far to near)
      const sortedRings = [...ringsRef.current].sort((a, b) => b.z - a.z);

      // Draw rings
      sortedRings.forEach((ring) => {
        const z = ring.z;
        const fov = 400;
        const scale = fov / (z + fov);

        // Ring properties
        const baseRadius = 800;
        const radius = baseRadius * scale;

        if (radius < 2) return;

        // Position offset based on z for spiral effect
        const spiralX = Math.sin(z * 0.003 + ring.rotation) * 50 * scale;
        const spiralY = Math.cos(z * 0.003 + ring.rotation) * 50 * scale;

        const x = centerX + spiralX;
        const y = centerY + spiralY;

        // Color cycling based on depth
        const hue = (z * 0.2 + Date.now() * 0.02) % 360;
        const saturation = 100;
        const lightness = 50 + (1 - scale) * 20;
        const alpha = Math.min(1, scale * 2);

        // Draw octagon/hexagon shape for retro feel
        const sides = 8;
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = Math.max(1, 3 * scale);
        ctx.shadowBlur = 20 * scale;
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;

        for (let i = 0; i <= sides; i++) {
          const angle = (i / sides) * Math.PI * 2 + ring.rotation;
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.closePath();
        ctx.stroke();

        // Draw inner geometric patterns for some rings
        if (z < 800 && radius > 50) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${(hue + 180) % 360}, ${saturation}%, ${lightness}%, ${alpha * 0.3})`;
          ctx.lineWidth = 1;

          // Cross pattern
          const innerRadius = radius * 0.7;
          for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + ring.rotation;
            ctx.moveTo(x, y);
            ctx.lineTo(
              x + Math.cos(angle) * innerRadius,
              y + Math.sin(angle) * innerRadius
            );
          }
          ctx.stroke();
        }

        // Update ring position (move toward viewer)
        ring.z -= 8;
        ring.rotation += 0.002;

        // Reset ring when it passes the viewer
        if (ring.z < 0) {
          ring.z = maxZ;
          ring.rotation = Math.random() * Math.PI * 2;
        }
      });

      // Draw center glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        150
      );
      gradient.addColorStop(0, 'rgba(57, 255, 20, 0.1)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 16, 240, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fill();

      // Draw speed lines at edges
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const innerR = 200;
        const outerR = Math.max(width, height);

        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * innerR,
          centerY + Math.sin(angle) * innerR
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * outerR,
          centerY + Math.sin(angle) * outerR
        );
        ctx.stroke();
      }

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
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: '#0a0a0a' }}
      aria-hidden="true"
    />
  );
}
