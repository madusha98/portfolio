# Gyro Ball Game — Mobile Hero Section Game

## Overview

Replace the Pong game with a gyroscope-controlled ball roller on mobile devices. Desktop keeps Pong. The player tilts their phone to roll a neon ball, collecting cyan dots for points.

## Detection

Mobile detected via `(pointer: coarse)` media query. Hero section conditionally renders `GyroBallGame` (mobile) or `PongGame` (desktop).

## Game States

1. **Idle** — Default. Static ball in center, "Tap to Play" label. No gyro permission requested. Score hidden.
2. **Playing** — Gyro active, ball rolling, dot spawned, score visible, pause button shown.
3. **Paused** — Ball and dot frozen, "Paused" label, pause toggles back to playing.

## Start Flow

1. User taps canvas or play button.
2. iOS: call `DeviceOrientationEvent.requestPermission()`. If denied, fall back to touch-drag.
3. Android / granted: start `deviceorientation` listener.
4. Transition to Playing, spawn first dot, show score.

## Physics

- `DeviceOrientationEvent` provides `beta` (front-back) and `gamma` (left-right) for acceleration.
- Light friction/damping for natural deceleration.
- Ball bounces off walls with slight energy loss.
- Collision: distance check between ball center and dot center.

## Touch Fallback

If gyro unavailable or denied, track touch position relative to ball and apply acceleration toward touch point. Same physics, different input.

## Visuals

- **Ball**: ~10px radius, `#39ff14` green, radial glow, trail of 6-8 fading positions.
- **Dot**: ~6px radius, `#00ffff` cyan, subtle pulse animation. One active at a time.
- **On collect**: Magenta (`#ff10f0`) particle burst (8-12 particles), brief screen flash, score increment.
- **Container**: Same pixel-border box as Pong, same max-width, 400px height, 7-segment score (top-right), pause button (top-left).

## Accessibility

- Respects `prefers-reduced-motion` — hides entirely.
- Pause button stops game loop and removes gyro listener (saves battery).
- No auto-sound.

## Files

- **New**: `src/components/effects/gyro-ball-game.tsx`
- **Modify**: `src/components/sections/hero-section.tsx` — conditional render
- **Modify**: `src/components/effects/index.ts` — export new component
