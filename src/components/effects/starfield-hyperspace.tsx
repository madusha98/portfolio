'use client';

import { useEffect, useRef, useState } from 'react';

interface Star {
	x: number;
	y: number;
	z: number;
	prevZ: number;
	color: string;
}

const STAR_COLORS = [
	'#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
	'#e0e0ff', '#e0e0ff', '#c0c0ff',
	'#39ff14', '#00ffff', '#ff10f0',
];

export function StarfieldHyperspace() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);
	const currentSpeedRef = useRef(0);
	const isInViewRef = useRef(true);
	const hyperspaceTimeRef = useRef(0);
	const dismissedRef = useRef(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		setIsVisible(!mediaQuery.matches);
		const handleChange = (e: MediaQueryListEvent) => setIsVisible(!e.matches);
		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	useEffect(() => {
		if (!isVisible) return;

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		const isMobile = window.innerWidth < 768;
		const starCount = isMobile ? 80 : 300;
		const maxZ = 1000;
		const baseSpeed = 1.2;
		const maxSpeed = 30;
		const stars: Star[] = [];

		let width = 0;
		let height = 0;
		let viewportHeight = window.innerHeight;

		const resize = () => {
			width = window.innerWidth;
			height = window.innerHeight;
			viewportHeight = height;
			canvas.width = width;
			canvas.height = height;
		};

		const initStars = () => {
			stars.length = 0;
			for (let i = 0; i < starCount; i++) {
				const z = Math.random() * maxZ;
				stars.push({
					x: (Math.random() - 0.5) * width * 2,
					y: (Math.random() - 0.5) * height * 2,
					z,
					prevZ: z,
					color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
				});
			}
		};

		// Pause rendering when off-screen
		const observer = new IntersectionObserver(
			([entry]) => { isInViewRef.current = entry.isIntersecting; },
			{ threshold: 0 }
		);
		observer.observe(canvas);

		const animate = () => {
			animationRef.current = requestAnimationFrame(animate);

			if (!isInViewRef.current) return;

			const scrollProgress = Math.min(window.scrollY / viewportHeight, 1);

			// Re-activate when scrolled back to top
			if (dismissedRef.current) {
				if (scrollProgress < 0.05) {
					dismissedRef.current = false;
					hyperspaceTimeRef.current = 0;
					canvas.style.opacity = '1';
				}
				return;
			}

			// Auto-dismiss: once lightspeed is reached, fade out after 2s
			if (scrollProgress >= 0.95 && hyperspaceTimeRef.current === 0) {
				hyperspaceTimeRef.current = Date.now();
			}
			if (scrollProgress < 0.5) {
				hyperspaceTimeRef.current = 0;
			}
			if (hyperspaceTimeRef.current > 0) {
				const elapsed = Date.now() - hyperspaceTimeRef.current;
				if (elapsed > 2000) {
					const fadeOut = Math.min((elapsed - 2000) / 1500, 1);
					canvas.style.opacity = String(1 - fadeOut);
					if (fadeOut >= 1) {
						dismissedRef.current = true;
						return;
					}
				}
			}

			const targetSpeed = baseSpeed + scrollProgress * (maxSpeed - baseSpeed);
			currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 0.08;
			const speed = currentSpeedRef.current;
			const speedNorm = (speed - baseSpeed) / (maxSpeed - baseSpeed);

			// Trail effect
			const trailAlpha = 0.3 - speedNorm * 0.2;
			ctx.fillStyle = `rgba(10,10,10,${trailAlpha})`;
			ctx.fillRect(0, 0, width, height);

			const centerX = width * 0.5;
			const centerY = height * 0.5;
			const fov = Math.min(width, height) * 0.5;

			// Batch all streaks into a single path per color
			const batches = new Map<string, { lines: number[]; dots: number[]; }>();

			for (let i = 0; i < stars.length; i++) {
				const star = stars[i];
				star.prevZ = star.z;
				star.z -= speed;

				if (star.z <= 0) {
					star.z = maxZ;
					star.prevZ = maxZ;
					star.x = (Math.random() - 0.5) * width * 2;
					star.y = (Math.random() - 0.5) * height * 2;
					star.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
					continue;
				}

				const sx = (star.x / star.z) * fov + centerX;
				const sy = (star.y / star.z) * fov + centerY;

				// Skip off-screen
				if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

				const px = (star.x / star.prevZ) * fov + centerX;
				const py = (star.y / star.prevZ) * fov + centerY;

				const depthRatio = 1 - star.z / maxZ;
				const size = depthRatio * 2.5 + 0.3;
				const alpha = Math.min(1, depthRatio * 1.5);

				let batch = batches.get(star.color);
				if (!batch) {
					batch = { lines: [], dots: [] };
					batches.set(star.color, batch);
				}
				// Store: px, py, sx, sy, size, alpha
				batch.lines.push(px, py, sx, sy, size, alpha);
				// Store: sx, sy, size, alpha
				batch.dots.push(sx, sy, size, alpha);
			}

			// Draw batched by color — avoids per-star state changes
			batches.forEach((batch, color) => {
				const { lines, dots } = batch;

				// Draw streak lines
				ctx.strokeStyle = color;
				for (let i = 0; i < lines.length; i += 6) {
					ctx.globalAlpha = lines[i + 5];
					ctx.lineWidth = lines[i + 4];
					ctx.beginPath();
					ctx.moveTo(lines[i], lines[i + 1]);
					ctx.lineTo(lines[i + 2], lines[i + 3]);
					ctx.stroke();
				}

				// Draw head dots
				ctx.fillStyle = '#ffffff';
				for (let i = 0; i < dots.length; i += 4) {
					const s = dots[i + 2];
					ctx.globalAlpha = Math.min(1, dots[i + 3] + 0.2);
					ctx.fillRect(dots[i] - s * 0.5, dots[i + 1] - s * 0.5, s, s);
				}
			});

			// Central glow at hyperspace (skip on mobile)
			if (!isMobile && speed > 5) {
				const glowIntensity = (speed - 5) / (maxSpeed - 5);
				const gradient = ctx.createRadialGradient(
					centerX, centerY, 0,
					centerX, centerY, Math.min(width, height) * 0.3
				);
				gradient.addColorStop(0, `rgba(200,220,255,${glowIntensity * 0.12})`);
				gradient.addColorStop(0.5, `rgba(100,150,255,${glowIntensity * 0.04})`);
				gradient.addColorStop(1, 'rgba(0,0,0,0)');
				ctx.globalAlpha = 1;
				ctx.fillStyle = gradient;
				ctx.fillRect(0, 0, width, height);
			}

			ctx.globalAlpha = 1;
		};

		resize();
		initStars();
		animate();

		const handleResize = () => { resize(); initStars(); };
		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationRef.current);
			window.removeEventListener('resize', handleResize);
			observer.disconnect();
		};
	}, [isVisible]);

	if (!isVisible) return null;

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 z-0"
			aria-hidden="true"
		/>
	);
}
