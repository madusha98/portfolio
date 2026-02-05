'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vertices: number[];
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const asteroidsRef = useRef<Asteroid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const nextIdRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsVisible(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const createAsteroid = useCallback((x?: number, y?: number, size?: number): Asteroid => {
    const canvas = canvasRef.current;
    const width = canvas?.width || window.innerWidth;
    const height = canvas?.height || window.innerHeight;

    // Spawn from edges if no position specified
    let spawnX = x ?? 0;
    let spawnY = y ?? 0;
    let vx = 0;
    let vy = 0;

    if (x === undefined) {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: // top
          spawnX = Math.random() * width;
          spawnY = -50;
          vx = (Math.random() - 0.5) * 1.5;
          vy = Math.random() * 0.8 + 0.3;
          break;
        case 1: // right
          spawnX = width + 50;
          spawnY = Math.random() * height;
          vx = -(Math.random() * 0.8 + 0.3);
          vy = (Math.random() - 0.5) * 1.5;
          break;
        case 2: // bottom
          spawnX = Math.random() * width;
          spawnY = height + 50;
          vx = (Math.random() - 0.5) * 1.5;
          vy = -(Math.random() * 0.8 + 0.3);
          break;
        case 3: // left
          spawnX = -50;
          spawnY = Math.random() * height;
          vx = Math.random() * 0.8 + 0.3;
          vy = (Math.random() - 0.5) * 1.5;
          break;
      }
    } else {
      vx = (Math.random() - 0.5) * 2;
      vy = (Math.random() - 0.5) * 2;
    }

    // Generate irregular polygon vertices
    const vertexCount = Math.floor(Math.random() * 4) + 6;
    const vertices: number[] = [];
    for (let i = 0; i < vertexCount; i++) {
      const angle = (i / vertexCount) * Math.PI * 2;
      const radius = 0.7 + Math.random() * 0.5;
      vertices.push(radius);
    }

    return {
      id: nextIdRef.current++,
      x: spawnX,
      y: spawnY,
      vx,
      vy,
      size: size ?? (Math.random() * 30 + 40),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      vertices,
    };
  }, []);

  const shoot = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Shoot from cursor position toward center, or in direction of click
    const angle = Math.random() * Math.PI * 2;
    const speed = 8;

    bulletsRef.current.push({
      id: nextIdRef.current++,
      x: mouseRef.current.x,
      y: mouseRef.current.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60,
    });

    // Shoot in 3 directions for spread effect
    for (let i = -1; i <= 1; i++) {
      const spreadAngle = angle + i * 0.3;
      bulletsRef.current.push({
        id: nextIdRef.current++,
        x: clickX,
        y: clickY,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        life: 50,
      });
    }
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
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Initialize asteroids
    for (let i = 0; i < 6; i++) {
      asteroidsRef.current.push(createAsteroid());
    }

    const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 30,
          color,
        });
      }
    };

    const drawAsteroid = (asteroid: Asteroid) => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(asteroid.rotation);

      ctx.beginPath();
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#39ff14';

      const vertices = asteroid.vertices;
      for (let i = 0; i <= vertices.length; i++) {
        const idx = i % vertices.length;
        const angle = (idx / vertices.length) * Math.PI * 2;
        const radius = vertices[idx] * asteroid.size;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.closePath();
      ctx.stroke();

      // Inner detail lines
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-asteroid.size * 0.3, -asteroid.size * 0.2);
      ctx.lineTo(asteroid.size * 0.2, asteroid.size * 0.3);
      ctx.moveTo(asteroid.size * 0.1, -asteroid.size * 0.3);
      ctx.lineTo(-asteroid.size * 0.2, asteroid.size * 0.1);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Spawn new asteroids occasionally
      if (asteroidsRef.current.length < 8 && Math.random() < 0.01) {
        asteroidsRef.current.push(createAsteroid());
      }

      // Update and draw asteroids
      asteroidsRef.current = asteroidsRef.current.filter((asteroid) => {
        asteroid.x += asteroid.vx;
        asteroid.y += asteroid.vy;
        asteroid.rotation += asteroid.rotationSpeed;

        // Remove if off screen (with margin)
        const margin = 100;
        if (
          asteroid.x < -margin ||
          asteroid.x > width + margin ||
          asteroid.y < -margin ||
          asteroid.y > height + margin
        ) {
          return false;
        }

        drawAsteroid(asteroid);
        return true;
      });

      // Update and draw bullets
      ctx.shadowBlur = 0;
      bulletsRef.current = bulletsRef.current.filter((bullet) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.life--;

        if (bullet.life <= 0) return false;

        // Draw bullet
        const alpha = bullet.life / 50;
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bullet.x, bullet.y);
        ctx.lineTo(bullet.x - bullet.vx * 3, bullet.y - bullet.vy * 3);
        ctx.stroke();

        return true;
      });

      // Check bullet-asteroid collisions
      bulletsRef.current = bulletsRef.current.filter((bullet) => {
        let hit = false;

        asteroidsRef.current = asteroidsRef.current.filter((asteroid) => {
          const dx = bullet.x - asteroid.x;
          const dy = bullet.y - asteroid.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < asteroid.size) {
            hit = true;
            createExplosion(asteroid.x, asteroid.y, '#39ff14');

            // Split into smaller asteroids
            if (asteroid.size > 20) {
              for (let i = 0; i < 2; i++) {
                asteroidsRef.current.push(
                  createAsteroid(asteroid.x, asteroid.y, asteroid.size * 0.5)
                );
              }
            }

            // Update score
            scoreRef.current += Math.floor(100 / asteroid.size * 10);
            setScore(scoreRef.current);

            return false;
          }
          return true;
        });

        return !hit;
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        particle.life--;

        if (particle.life <= 0) return false;

        const alpha = particle.life / 30;
        ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Draw crosshair at mouse
      ctx.strokeStyle = 'rgba(255, 16, 240, 0.5)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#ff10f0';

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const crossSize = 15;

      ctx.beginPath();
      ctx.moveTo(mx - crossSize, my);
      ctx.lineTo(mx - 5, my);
      ctx.moveTo(mx + 5, my);
      ctx.lineTo(mx + crossSize, my);
      ctx.moveTo(mx, my - crossSize);
      ctx.lineTo(mx, my - 5);
      ctx.moveTo(mx, my + 5);
      ctx.lineTo(mx, my + crossSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(mx, my, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', shoot);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', shoot);
    };
  }, [isVisible, createAsteroid, shoot]);

  if (!isVisible) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: '#0a0a0a' }}
        aria-hidden="true"
      />
      {score > 0 && (
        <div
          className="fixed top-20 right-4 font-mono text-accent text-sm z-50 pointer-events-none select-none opacity-60"
          aria-hidden="true"
        >
          SCORE: {score.toString().padStart(6, '0')}
        </div>
      )}
    </>
  );
}
