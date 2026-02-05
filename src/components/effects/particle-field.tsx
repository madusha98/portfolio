'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;
  opacity: number;
}

const COLORS = ['#39ff14', '#00ffff', '#ff10f0'];

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedY: -(Math.random() * 0.5 + 0.2),
          speedX: (Math.random() - 0.5) * 0.3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.y += particle.speedY;
        particle.x += particle.speedX;

        // Add slight wobble
        particle.x += Math.sin(Date.now() * 0.001 + particle.y * 0.01) * 0.2;

        // Wrap around screen
        if (particle.y < -particle.size) {
          particle.y = canvas.height + particle.size;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x < -particle.size) {
          particle.x = canvas.width + particle.size;
        }
        if (particle.x > canvas.width + particle.size) {
          particle.x = -particle.size;
        }

        // Draw pixel (square)
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
