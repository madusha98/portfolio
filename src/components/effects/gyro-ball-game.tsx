'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// 7-segment display digit patterns
const DIGIT_PATTERNS: Record<string, number[][]> = {
  '0': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  '1': [[0,0,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
  '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
  '3': [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
  '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  '5': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  '6': [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
  '7': [[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
  '8': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
  '9': [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
};

const OPACITY = {
  ball: 0.5,
  trail: 0.25,
  dot: 0.6,
  score: 0.3,
  particles: 0.5,
  flash: 0.15,
  border: 0.15,
  label: 0.4,
};

type GameState = 'idle' | 'playing' | 'paused';

export function GyroBallGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [gameState, setGameState] = useState<GameState>('idle');
  const gameStateRef = useRef<GameState>('idle');
  const particlesRef = useRef<Particle[]>([]);
  const screenFlashRef = useRef({ intensity: 0, color: '#ff10f0' });
  const scoreRef = useRef(0);
  const scoreAnimRef = useRef({ scale: 1 });
  const inputModeRef = useRef<'gyro' | 'touch'>('gyro');
  const touchTargetRef = useRef<{ x: number; y: number } | null>(null);
  const gyroRef = useRef<{ beta: number; gamma: number }>({ beta: 0, gamma: 0 });

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsVisible(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsVisible(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    gyroRef.current = {
      beta: e.beta ?? 0,   // front-back tilt (-180 to 180)
      gamma: e.gamma ?? 0, // left-right tilt (-90 to 90)
    };
  }, []);

  const startGame = useCallback(async () => {
    if (gameStateRef.current === 'playing') return;

    // Try to get gyro permission (iOS requires explicit request)
    let gyroAvailable = false;

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DOE.requestPermission === 'function') {
      try {
        const permission = await DOE.requestPermission();
        gyroAvailable = permission === 'granted';
      } catch {
        gyroAvailable = false;
      }
    } else {
      // Android or browsers that don't require permission
      gyroAvailable = 'DeviceOrientationEvent' in window;
    }

    if (gyroAvailable) {
      inputModeRef.current = 'gyro';
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      inputModeRef.current = 'touch';
    }

    scoreRef.current = 0;
    setGameState('playing');
  }, [handleOrientation]);

  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'playing') {
      if (inputModeRef.current === 'gyro') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      setGameState('paused');
    } else if (gameStateRef.current === 'paused') {
      if (inputModeRef.current === 'gyro') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
      setGameState('playing');
    }
  }, [handleOrientation]);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // Ball state
    const ballRadius = 10;
    let ballX = 0;
    let ballY = 0;
    let ballVX = 0;
    let ballVY = 0;
    const friction = 0.98;
    const bounceDamping = 0.7;
    const gyroSensitivity = 0.4;
    const touchAcceleration = 0.3;

    // Dot state
    const dotRadius = 6;
    let dotX = 0;
    let dotY = 0;
    let dotSpawned = false;
    let dotPulse = 0;

    // Trail
    const trails: { x: number; y: number; age: number }[] = [];

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;

      // Keep ball in bounds after resize
      if (ballX === 0 && ballY === 0) {
        ballX = width / 2;
        ballY = height / 2;
      } else {
        ballX = Math.max(ballRadius, Math.min(width - ballRadius, ballX));
        ballY = Math.max(ballRadius, Math.min(height - ballRadius, ballY));
      }
    };

    const spawnDot = () => {
      const padding = 30;
      dotX = padding + Math.random() * (width - padding * 2);
      dotY = padding + Math.random() * (height - padding * 2);

      // Ensure dot isn't too close to ball
      const dx = dotX - ballX;
      const dy = dotY - ballY;
      if (Math.sqrt(dx * dx + dy * dy) < 60) {
        spawnDot();
        return;
      }

      dotSpawned = true;
    };

    const createCollectExplosion = (x: number, y: number) => {
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 30,
          maxLife: 30,
          color: '#ff10f0',
          size: Math.random() * 3 + 2,
        });
      }
      screenFlashRef.current = { intensity: 1, color: '#ff10f0' };
    };

    const drawPixelDigit = (digit: string, x: number, y: number, pixelSize: number, color: string, scale: number) => {
      const pattern = DIGIT_PATTERNS[digit];
      if (!pattern) return;

      const actualSize = pixelSize * scale;
      const offsetX = x - (pattern[0].length * actualSize) / 2;
      const offsetY = y - (pattern.length * actualSize) / 2;

      ctx.shadowBlur = 10 * scale;
      ctx.shadowColor = color;
      ctx.fillStyle = color;

      pattern.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
          if (cell) {
            ctx.fillRect(
              offsetX + colIdx * actualSize,
              offsetY + rowIdx * actualSize,
              actualSize - 1,
              actualSize - 1
            );
          }
        });
      });

      ctx.shadowBlur = 0;
    };

    const drawScore = () => {
      if (gameStateRef.current === 'idle') return;

      scoreAnimRef.current.scale += (1 - scoreAnimRef.current.scale) * 0.1;

      const pixelSize = 5;
      const scoreStr = scoreRef.current.toString();
      const scoreX = width - 30;
      const scoreY = 22;

      ctx.globalAlpha = OPACITY.score * scoreAnimRef.current.scale;
      scoreStr.split('').forEach((digit, i) => {
        const digitX = scoreX - (scoreStr.length - 1 - i) * (pixelSize * 4);
        drawPixelDigit(digit, digitX, scoreY, pixelSize, '#39ff14', scoreAnimRef.current.scale);
      });
      ctx.globalAlpha = 1;
    };

    const drawBall = () => {
      // Trail
      trails.forEach((trail) => {
        const alpha = (1 - trail.age / 10) * OPACITY.trail;
        if (alpha > 0) {
          ctx.beginPath();
          ctx.arc(trail.x, trail.y, ballRadius - 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`;
          ctx.fill();
        }
      });

      // Ball
      ctx.globalAlpha = OPACITY.ball;
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#39ff14';
      ctx.fillStyle = '#39ff14';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawDot = () => {
      if (!dotSpawned || gameStateRef.current === 'idle') return;

      dotPulse += 0.06;
      const pulse = 1 + Math.sin(dotPulse) * 0.2;
      const r = dotRadius * pulse;

      ctx.globalAlpha = OPACITY.dot;
      ctx.beginPath();
      ctx.arc(dotX, dotY, r, 0, Math.PI * 2);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = '#00ffff';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawParticles = () => {
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life--;

        if (p.life <= 0) return false;

        const alpha = (p.life / p.maxLife) * OPACITY.particles;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        return true;
      });
    };

    const drawScreenFlash = () => {
      if (screenFlashRef.current.intensity > 0) {
        ctx.fillStyle = screenFlashRef.current.color;
        ctx.globalAlpha = screenFlashRef.current.intensity * OPACITY.flash;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        screenFlashRef.current.intensity *= 0.85;
      }
    };

    const drawIdleState = () => {
      // Static ball in center
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, ballRadius, 0, Math.PI * 2);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#39ff14';
      ctx.fillStyle = '#39ff14';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // "Tap to Play" label
      ctx.globalAlpha = OPACITY.label;
      ctx.font = '12px monospace';
      ctx.fillStyle = '#39ff14';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#39ff14';
      ctx.fillText('TAP TO PLAY', width / 2, height / 2 + 35);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Play icon (triangle)
      ctx.globalAlpha = OPACITY.label;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 5, height / 2 + 45);
      ctx.lineTo(width / 2 - 5, height / 2 + 57);
      ctx.lineTo(width / 2 + 7, height / 2 + 51);
      ctx.closePath();
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#39ff14';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawPausedLabel = () => {
      ctx.globalAlpha = OPACITY.label;
      ctx.font = '12px monospace';
      ctx.fillStyle = '#39ff14';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#39ff14';
      ctx.fillText('PAUSED', width / 2, height / 2);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    // Touch handlers for fallback
    const handleTouchStart = (e: TouchEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (inputModeRef.current !== 'touch') return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchTargetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (inputModeRef.current !== 'touch') return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchTargetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const handleTouchEnd = () => {
      touchTargetRef.current = null;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const state = gameStateRef.current;

      if (state === 'idle') {
        drawIdleState();
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      if (state === 'playing') {
        // Spawn dot if needed
        if (!dotSpawned) {
          spawnDot();
        }

        // Apply input
        if (inputModeRef.current === 'gyro') {
          // gamma = left-right tilt, beta = front-back tilt
          const ax = gyroRef.current.gamma * gyroSensitivity;
          const ay = (gyroRef.current.beta - 40) * gyroSensitivity; // offset for natural phone hold angle
          ballVX += ax * 0.05;
          ballVY += ay * 0.05;
        } else if (touchTargetRef.current) {
          const dx = touchTargetRef.current.x - ballX;
          const dy = touchTargetRef.current.y - ballY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            ballVX += (dx / dist) * touchAcceleration;
            ballVY += (dy / dist) * touchAcceleration;
          }
        }

        // Apply friction
        ballVX *= friction;
        ballVY *= friction;

        // Cap speed
        const speed = Math.sqrt(ballVX * ballVX + ballVY * ballVY);
        const maxSpeed = 8;
        if (speed > maxSpeed) {
          ballVX = (ballVX / speed) * maxSpeed;
          ballVY = (ballVY / speed) * maxSpeed;
        }

        // Move ball
        ballX += ballVX;
        ballY += ballVY;

        // Wall bounce
        if (ballX - ballRadius < 0) {
          ballX = ballRadius;
          ballVX = Math.abs(ballVX) * bounceDamping;
        } else if (ballX + ballRadius > width) {
          ballX = width - ballRadius;
          ballVX = -Math.abs(ballVX) * bounceDamping;
        }

        if (ballY - ballRadius < 0) {
          ballY = ballRadius;
          ballVY = Math.abs(ballVY) * bounceDamping;
        } else if (ballY + ballRadius > height) {
          ballY = height - ballRadius;
          ballVY = -Math.abs(ballVY) * bounceDamping;
        }

        // Trail
        trails.push({ x: ballX, y: ballY, age: 0 });
        trails.forEach(t => t.age++);
        while (trails.length > 8) trails.shift();

        // Dot collision
        if (dotSpawned) {
          const dx = ballX - dotX;
          const dy = ballY - dotY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ballRadius + dotRadius) {
            scoreRef.current++;
            scoreAnimRef.current.scale = 2;
            createCollectExplosion(dotX, dotY);
            dotSpawned = false;
          }
        }
      }

      // Draw everything
      drawScreenFlash();
      drawParticles();
      drawDot();
      drawBall();
      drawScore();

      if (state === 'paused') {
        drawPausedLabel();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    ballX = width / 2;
    ballY = height / 2;
    particlesRef.current = [];
    screenFlashRef.current.intensity = 0;
    animate();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('deviceorientation', handleOrientation);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isVisible, handleOrientation]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto"
      style={{ height: '400px' }}
    >
      {/* Retro pixel border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `2px solid rgba(57, 255, 20, ${OPACITY.border})`,
          boxShadow: `4px 4px 0 0 rgba(57, 255, 20, ${OPACITY.border * 0.6}), inset 0 0 30px rgba(57, 255, 20, 0.03)`,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        aria-hidden="true"
        onClick={() => {
          if (gameState === 'idle') startGame();
        }}
      />
      {/* Pause/Play button - only shown when game is active */}
      {gameState !== 'idle' && (
        <button
          onClick={togglePause}
          className="absolute top-2 left-2 z-10 font-mono text-[10px] px-2 py-1 transition-colors"
          style={{
            color: 'rgba(57, 255, 20, 0.4)',
            border: '1px solid rgba(57, 255, 20, 0.15)',
            background: 'rgba(10, 10, 10, 0.5)',
          }}
          aria-label={gameState === 'paused' ? 'Resume game' : 'Pause game'}
        >
          {gameState === 'paused' ? '▶ PLAY' : '❚❚ PAUSE'}
        </button>
      )}
    </div>
  );
}
