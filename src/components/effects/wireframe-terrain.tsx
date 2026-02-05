'use client';

import { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function WireframeTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
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
      mouseRef.current = {
        x: e.clientX / width,
        y: e.clientY / height,
      };
    };

    // Simple noise function for terrain
    const noise = (x: number, z: number, time: number): number => {
      const scale = 0.02;
      const val =
        Math.sin(x * scale + time * 0.5) *
        Math.cos(z * scale + time * 0.3) *
        Math.sin((x + z) * scale * 0.5 + time * 0.2);
      return val * 80 + Math.sin(x * 0.01 + time) * 20 + Math.cos(z * 0.015) * 30;
    };

    // Project 3D point to 2D with perspective
    const project = (point: Point3D, rotX: number, rotY: number): { x: number; y: number; z: number } | null => {
      // Apply rotation based on mouse
      let { x, y, z } = point;

      // Rotate around Y axis (horizontal mouse movement)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const newX = x * cosY - z * sinY;
      const newZ = x * sinY + z * cosY;
      x = newX;
      z = newZ;

      // Rotate around X axis (vertical mouse movement)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const newY = y * cosX - z * sinX;
      const newZ2 = y * sinX + z * cosX;
      y = newY;
      z = newZ2;

      // Perspective projection
      const fov = 500;
      const viewerZ = 600;

      if (z + viewerZ <= 0) return null;

      const scale = fov / (z + viewerZ);

      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        z: z,
      };
    };

    const drawLine = (
      ctx: CanvasRenderingContext2D,
      p1: { x: number; y: number; z: number },
      p2: { x: number; y: number; z: number },
      color: string,
      baseAlpha: number
    ) => {
      // Fade based on distance
      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0, Math.min(1, baseAlpha * (1 - avgZ / 1500)));

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = Math.max(0.5, 2 - avgZ / 500);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;

      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Clear for crisp lines
      ctx.clearRect(0, 0, width, height);

      // Mouse-based rotation
      const rotY = (mouseRef.current.x - 0.5) * 0.4;
      const rotX = (mouseRef.current.y - 0.5) * 0.3 + 0.3;

      // Terrain parameters
      const gridSize = 40;
      const gridSpacing = 50;
      const terrainDepth = 1200;
      const terrainWidth = 1000;

      // Store projected points for the grid
      const points: ({ x: number; y: number; z: number } | null)[][] = [];

      // Generate terrain points
      for (let zIdx = 0; zIdx <= gridSize; zIdx++) {
        points[zIdx] = [];
        for (let xIdx = 0; xIdx <= gridSize; xIdx++) {
          const x = (xIdx - gridSize / 2) * gridSpacing * (terrainWidth / (gridSize * gridSpacing / 2));
          const z = zIdx * (terrainDepth / gridSize) + 100;

          // Animated terrain height
          const scrollOffset = time * 100;
          const y = -noise(x, z + scrollOffset, time) - 150;

          const projected = project({ x, y, z }, rotX, rotY);
          points[zIdx][xIdx] = projected;
        }
      }

      // Draw horizontal grid lines (going into distance)
      for (let zIdx = 0; zIdx < gridSize; zIdx++) {
        for (let xIdx = 0; xIdx < gridSize; xIdx++) {
          const p1 = points[zIdx][xIdx];
          const p2 = points[zIdx][xIdx + 1];

          if (p1 && p2) {
            // Color based on height and position
            const avgZ = (p1.z + p2.z) / 2;
            const hue = 150 + (avgZ / terrainDepth) * 30; // Green to cyan
            drawLine(ctx, p1, p2, `hsl(${hue}, 100%, 50%)`, 0.8);
          }
        }
      }

      // Draw vertical grid lines (going into distance)
      for (let xIdx = 0; xIdx <= gridSize; xIdx++) {
        for (let zIdx = 0; zIdx < gridSize; zIdx++) {
          const p1 = points[zIdx][xIdx];
          const p2 = points[zIdx + 1]?.[xIdx];

          if (p1 && p2) {
            const avgZ = (p1.z + p2.z) / 2;
            const hue = 150 + (avgZ / terrainDepth) * 30;
            drawLine(ctx, p1, p2, `hsl(${hue}, 100%, 50%)`, 0.6);
          }
        }
      }

      // Draw grid floor
      const floorY = 100;
      const floorPoints: ({ x: number; y: number; z: number } | null)[][] = [];
      const floorGridSize = 30;
      const floorSpacing = 80;

      for (let zIdx = 0; zIdx <= floorGridSize; zIdx++) {
        floorPoints[zIdx] = [];
        for (let xIdx = 0; xIdx <= floorGridSize; xIdx++) {
          const x = (xIdx - floorGridSize / 2) * floorSpacing;
          const z = zIdx * floorSpacing + 100 + (time * 80) % floorSpacing;
          const y = floorY;

          const projected = project({ x, y, z }, rotX, rotY);
          floorPoints[zIdx][xIdx] = projected;
        }
      }

      // Draw floor horizontal lines
      for (let zIdx = 0; zIdx < floorGridSize; zIdx++) {
        for (let xIdx = 0; xIdx < floorGridSize; xIdx++) {
          const p1 = floorPoints[zIdx][xIdx];
          const p2 = floorPoints[zIdx][xIdx + 1];

          if (p1 && p2 && p1.y < height && p2.y < height) {
            drawLine(ctx, p1, p2, '#ff10f0', 0.3);
          }
        }
      }

      // Draw floor vertical lines
      for (let xIdx = 0; xIdx <= floorGridSize; xIdx++) {
        for (let zIdx = 0; zIdx < floorGridSize; zIdx++) {
          const p1 = floorPoints[zIdx][xIdx];
          const p2 = floorPoints[zIdx + 1]?.[xIdx];

          if (p1 && p2 && p1.y < height && p2.y < height) {
            drawLine(ctx, p1, p2, '#ff10f0', 0.3);
          }
        }
      }

      // Draw sun/moon
      const sunX = width / 2 + (mouseRef.current.x - 0.5) * 100;
      const sunY = height * 0.3 + (mouseRef.current.y - 0.5) * 50;
      const sunRadius = 60;

      // Sun glow
      const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
      gradient.addColorStop(0, 'rgba(255, 16, 240, 0.4)');
      gradient.addColorStop(0.5, 'rgba(255, 16, 240, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 16, 240, 0)');

      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Sun body with horizontal lines
      ctx.fillStyle = '#ff10f0';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sun lines
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      for (let i = -4; i <= 4; i++) {
        const lineY = sunY + i * 8;
        const dx = Math.sqrt(Math.max(0, sunRadius * sunRadius - (i * 8) * (i * 8)));
        if (dx > 0) {
          ctx.beginPath();
          ctx.moveTo(sunX - dx, lineY);
          ctx.lineTo(sunX + dx, lineY);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
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
      style={{ background: 'linear-gradient(to bottom, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)' }}
      aria-hidden="true"
    />
  );
}
