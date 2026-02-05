'use client';

import { useEffect, useRef, useState } from 'react';

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

// 7-segment display digit patterns (for retro score)
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

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const screenFlashRef = useRef({ intensity: 0, color: '#39ff14' });
  const scoreAnimRef = useRef({ player: 0, ai: 0, playerScale: 1, aiScale: 1 });

  // Opacity settings for subtle appearance
  const OPACITY = {
    paddle: 0.25,
    ball: 0.3,
    trail: 0.15,
    score: 0.15,
    net: 0.05,
    particles: 0.4,
    flash: 0.1,
  };

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

    // Game state
    const paddleWidth = 12;
    const paddleHeight = 100;
    const ballSize = 12;
    const paddleOffset = 40;

    let playerY = height / 2 - paddleHeight / 2;
    let aiY = height / 2 - paddleHeight / 2;
    let ballX = width / 2;
    let ballY = height / 2;
    let ballVX = 4;
    let ballVY = 2;
    let playerScore = 0;
    let aiScore = 0;
    let mouseY = height / 2;

    // Trail effect
    const trails: { x: number; y: number; age: number }[] = [];

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      playerY = Math.min(playerY, height - paddleHeight);
      aiY = Math.min(aiY, height - paddleHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseY = e.clientY;
    };

    // Ref to track pause state inside animation loop
    const isPausedRef = { current: isPaused };

    const createScoreExplosion = (x: number, y: number, color: string) => {
      // Create explosion particles
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60,
          maxLife: 60,
          color,
          size: Math.random() * 6 + 3,
        });
      }

      // Screen flash
      screenFlashRef.current = { intensity: 1, color };
    };

    const resetBall = (direction: number, scorer: 'player' | 'ai') => {
      // Trigger visual feedback
      const color = scorer === 'player' ? '#39ff14' : '#ff10f0';
      const explosionX = scorer === 'player' ? width - 50 : 50;
      createScoreExplosion(explosionX, ballY, color);

      // Animate score
      if (scorer === 'player') {
        scoreAnimRef.current.playerScale = 2;
      } else {
        scoreAnimRef.current.aiScale = 2;
      }

      // Reset ball
      ballX = width / 2;
      ballY = height / 2;
      ballVX = 4 * direction;
      ballVY = (Math.random() - 0.5) * 4;
      trails.length = 0;
    };

    const drawPixelDigit = (digit: string, x: number, y: number, pixelSize: number, color: string, scale: number) => {
      const pattern = DIGIT_PATTERNS[digit];
      if (!pattern) return;

      const actualSize = pixelSize * scale;
      const offsetX = x - (pattern[0].length * actualSize) / 2;
      const offsetY = y - (pattern.length * actualSize) / 2;

      ctx.shadowBlur = 15 * scale;
      ctx.shadowColor = color;
      ctx.fillStyle = color;

      pattern.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
          if (cell) {
            ctx.fillRect(
              offsetX + colIdx * actualSize,
              offsetY + rowIdx * actualSize,
              actualSize - 2,
              actualSize - 2
            );
          }
        });
      });

      ctx.shadowBlur = 0;
    };

    const drawRetroScore = () => {
      const pixelSize = 12;
      const scoreY = height / 2;

      // Animate scales back to 1
      scoreAnimRef.current.playerScale += (1 - scoreAnimRef.current.playerScale) * 0.1;
      scoreAnimRef.current.aiScale += (1 - scoreAnimRef.current.aiScale) * 0.1;

      // Player score (left side)
      const playerStr = playerScore.toString();
      const playerX = width / 4;
      ctx.globalAlpha = OPACITY.score * scoreAnimRef.current.playerScale;
      playerStr.split('').forEach((digit, i) => {
        const digitX = playerX + (i - (playerStr.length - 1) / 2) * (pixelSize * 4);
        drawPixelDigit(digit, digitX, scoreY, pixelSize, '#39ff14', scoreAnimRef.current.playerScale);
      });

      // AI score (right side)
      const aiStr = aiScore.toString();
      const aiX = (width / 4) * 3;
      ctx.globalAlpha = OPACITY.score * scoreAnimRef.current.aiScale;
      aiStr.split('').forEach((digit, i) => {
        const digitX = aiX + (i - (aiStr.length - 1) / 2) * (pixelSize * 4);
        drawPixelDigit(digit, digitX, scoreY, pixelSize, '#ff10f0', scoreAnimRef.current.aiScale);
      });

      ctx.globalAlpha = 1;
    };

    const drawPaddle = (x: number, y: number, isPlayer: boolean) => {
      const color = isPlayer ? '#39ff14' : '#ff10f0';

      ctx.globalAlpha = OPACITY.paddle;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, paddleWidth, paddleHeight);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y - 2, paddleWidth + 4, paddleHeight + 4);

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawBall = () => {
      trails.forEach((trail) => {
        const alpha = (1 - trail.age / 10) * OPACITY.trail;
        if (alpha > 0) {
          ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.fillRect(
            trail.x - ballSize / 2 + 2,
            trail.y - ballSize / 2 + 2,
            ballSize - 4,
            ballSize - 4
          );
        }
      });

      ctx.globalAlpha = OPACITY.ball;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawNet = () => {
      ctx.strokeStyle = `rgba(255, 255, 255, ${OPACITY.net})`;
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);
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
        ctx.shadowBlur = 8;
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

    const drawPauseIndicator = () => {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED - Press P to resume', width / 2, height - 30);
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.3)';
      ctx.fillRect(0, 0, width, height);

      if (!isPausedRef.current) {
        // Update player paddle
        const targetY = mouseY - paddleHeight / 2;
        playerY += (targetY - playerY) * 0.15;
        playerY = Math.max(0, Math.min(height - paddleHeight, playerY));

        // Update AI paddle (intentionally beatable)
        if (ballVX > 0) {
          const aiTargetY = ballY - paddleHeight / 2;
          const aiSpeed = Math.min(3, Math.abs(aiTargetY - aiY) * 0.025);
          if (aiTargetY > aiY) {
            aiY += aiSpeed;
          } else if (aiTargetY < aiY) {
            aiY -= aiSpeed;
          }
          if (Math.random() < 0.02) {
            aiY += (Math.random() - 0.5) * 20;
          }
        }
        aiY = Math.max(0, Math.min(height - paddleHeight, aiY));

        // Ball trail
        trails.push({ x: ballX, y: ballY, age: 0 });
        trails.forEach(t => t.age++);
        while (trails.length > 10) trails.shift();

        // Update ball
        ballX += ballVX;
        ballY += ballVY;

        // Ball collision with top/bottom
        if (ballY - ballSize / 2 <= 0 || ballY + ballSize / 2 >= height) {
          ballVY *= -1;
          ballY = ballY - ballSize / 2 <= 0 ? ballSize / 2 : height - ballSize / 2;
        }

        // Ball collision with player paddle
        if (
          ballX - ballSize / 2 <= paddleOffset + paddleWidth &&
          ballX + ballSize / 2 >= paddleOffset &&
          ballY >= playerY &&
          ballY <= playerY + paddleHeight
        ) {
          ballVX = Math.abs(ballVX) * 1.02;
          ballVX = Math.min(ballVX, 12);
          const hitPos = (ballY - playerY) / paddleHeight;
          ballVY = (hitPos - 0.5) * 8;
          ballX = paddleOffset + paddleWidth + ballSize / 2;
        }

        // Ball collision with AI paddle
        if (
          ballX + ballSize / 2 >= width - paddleOffset - paddleWidth &&
          ballX - ballSize / 2 <= width - paddleOffset &&
          ballY >= aiY &&
          ballY <= aiY + paddleHeight
        ) {
          ballVX = -Math.abs(ballVX) * 1.02;
          ballVX = Math.max(ballVX, -12);
          const hitPos = (ballY - aiY) / paddleHeight;
          ballVY = (hitPos - 0.5) * 8;
          ballX = width - paddleOffset - paddleWidth - ballSize / 2;
        }

        // Score points
        if (ballX < 0) {
          aiScore++;
          resetBall(1, 'ai');
        } else if (ballX > width) {
          playerScore++;
          resetBall(-1, 'player');
        }
      }

      // Draw everything (even when paused)
      drawScreenFlash();
      drawNet();
      drawRetroScore();
      drawParticles();
      drawPaddle(paddleOffset, playerY, true);
      drawPaddle(width - paddleOffset - paddleWidth, aiY, false);
      drawBall();

      if (isPausedRef.current) {
        drawPauseIndicator();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    resetBall(Math.random() > 0.5 ? 1 : -1, 'player');
    // Clear initial flash
    screenFlashRef.current.intensity = 0;
    particlesRef.current = [];

    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible, isPaused]);

  // Keyboard handler for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
