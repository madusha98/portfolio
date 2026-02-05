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

const OPACITY = {
  paddle: 0.4,
  ball: 0.5,
  trail: 0.25,
  score: 0.2,
  net: 0.08,
  particles: 0.5,
  flash: 0.15,
  border: 0.15,
};

export function PongGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const screenFlashRef = useRef({ intensity: 0, color: '#39ff14' });
  const scoreAnimRef = useRef({ playerScale: 1, aiScale: 1 });

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

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
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // Game state - scaled for smaller box
    const paddleWidth = 8;
    const paddleHeight = 50;
    const ballSize = 8;
    const paddleOffset = 15;

    let playerY = 0;
    let aiY = 0;
    let ballX = 0;
    let ballY = 0;
    let ballVX = 3;
    let ballVY = 1.5;
    let playerScore = 0;
    let aiScore = 0;
    let mouseY = 0; // Relative to canvas

    const trails: { x: number; y: number; age: number }[] = [];

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      playerY = Math.min(playerY, height - paddleHeight);
      aiY = Math.min(aiY, height - paddleHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseY = e.clientY - rect.top;
    };

    const createScoreExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 40,
          maxLife: 40,
          color,
          size: Math.random() * 4 + 2,
        });
      }
      screenFlashRef.current = { intensity: 1, color };
    };

    const resetBall = (direction: number, scorer: 'player' | 'ai') => {
      const color = scorer === 'player' ? '#39ff14' : '#ff10f0';
      const explosionX = scorer === 'player' ? width - 20 : 20;
      createScoreExplosion(explosionX, ballY, color);

      if (scorer === 'player') {
        scoreAnimRef.current.playerScale = 2;
      } else {
        scoreAnimRef.current.aiScale = 2;
      }

      ballX = width / 2;
      ballY = height / 2;
      ballVX = 3 * direction;
      ballVY = (Math.random() - 0.5) * 3;
      trails.length = 0;
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

    const drawRetroScore = () => {
      const pixelSize = 6;
      const scoreY = height / 2;

      scoreAnimRef.current.playerScale += (1 - scoreAnimRef.current.playerScale) * 0.1;
      scoreAnimRef.current.aiScale += (1 - scoreAnimRef.current.aiScale) * 0.1;

      const playerStr = playerScore.toString();
      const playerX = width / 4;
      ctx.globalAlpha = OPACITY.score * scoreAnimRef.current.playerScale;
      playerStr.split('').forEach((digit, i) => {
        const digitX = playerX + (i - (playerStr.length - 1) / 2) * (pixelSize * 4);
        drawPixelDigit(digit, digitX, scoreY, pixelSize, '#39ff14', scoreAnimRef.current.playerScale);
      });

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
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, paddleWidth, paddleHeight);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 1, y - 1, paddleWidth + 2, paddleHeight + 2);

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawBall = () => {
      trails.forEach((trail) => {
        const alpha = (1 - trail.age / 10) * OPACITY.trail;
        if (alpha > 0) {
          ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.fillRect(
            trail.x - ballSize / 2 + 1,
            trail.y - ballSize / 2 + 1,
            ballSize - 2,
            ballSize - 2
          );
        }
      });

      ctx.globalAlpha = OPACITY.ball;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawNet = () => {
      ctx.strokeStyle = `rgba(255, 255, 255, ${OPACITY.net})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
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


    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isPausedRef.current) {
        // Update player paddle
        const targetY = mouseY - paddleHeight / 2;
        playerY += (targetY - playerY) * 0.15;
        playerY = Math.max(0, Math.min(height - paddleHeight, playerY));

        // Update AI paddle (intentionally beatable)
        if (ballVX > 0) {
          const aiTargetY = ballY - paddleHeight / 2;
          const aiSpeed = Math.min(2, Math.abs(aiTargetY - aiY) * 0.03);
          if (aiTargetY > aiY) aiY += aiSpeed;
          else if (aiTargetY < aiY) aiY -= aiSpeed;
          if (Math.random() < 0.02) aiY += (Math.random() - 0.5) * 15;
        }
        aiY = Math.max(0, Math.min(height - paddleHeight, aiY));

        // Ball trail
        trails.push({ x: ballX, y: ballY, age: 0 });
        trails.forEach(t => t.age++);
        while (trails.length > 8) trails.shift();

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
          ballVX = Math.min(ballVX, 8);
          const hitPos = (ballY - playerY) / paddleHeight;
          ballVY = (hitPos - 0.5) * 6;
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
          ballVX = Math.max(ballVX, -8);
          const hitPos = (ballY - aiY) / paddleHeight;
          ballVY = (hitPos - 0.5) * 6;
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

      // Draw everything
      drawScreenFlash();
      drawNet();
      drawRetroScore();
      drawParticles();
      drawPaddle(paddleOffset, playerY, true);
      drawPaddle(width - paddleOffset - paddleWidth, aiY, false);
      drawBall();

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    playerY = height / 2 - paddleHeight / 2;
    aiY = height / 2 - paddleHeight / 2;
    ballX = width / 2;
    ballY = height / 2;
    particlesRef.current = [];
    screenFlashRef.current.intensity = 0;
    ballVX = 3 * (Math.random() > 0.5 ? 1 : -1);
    ballVY = (Math.random() - 0.5) * 3;
    animate();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);


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
      />
      {/* Pause/Play button */}
      <button
        onClick={() => setIsPaused(prev => !prev)}
        className="absolute top-2 right-2 z-10 font-mono text-[10px] px-2 py-1 transition-colors"
        style={{
          color: `rgba(57, 255, 20, 0.4)`,
          border: `1px solid rgba(57, 255, 20, 0.15)`,
          background: 'rgba(10, 10, 10, 0.5)',
        }}
        aria-label={isPaused ? 'Resume game' : 'Pause game'}
      >
        {isPaused ? '▶ PLAY' : '❚❚ PAUSE'}
      </button>
    </div>
  );
}
