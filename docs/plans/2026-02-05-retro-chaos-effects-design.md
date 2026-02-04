# Retro Chaos Effects Design

**Date:** 2026-02-05
**Goal:** Make the portfolio feel "alive" with full retro chaos - ambient motion, interactive feedback, and classic CRT/glitch effects.

---

## Effects Overview

### Global Ambient Effects (Always Running)

| Effect | Description | Intensity |
|--------|-------------|-----------|
| Noise/Static Overlay | Animated grain texture, 5-10% opacity | Subtle |
| CRT Scan Lines | Enhanced scan lines + moving horizontal line + flicker | Medium |
| Floating Particles | 50-100 neon pixels drifting upward | Medium |
| Neon Glow Pulses | Pulsing box-shadows on accent elements | Subtle-Medium |

### Interactive Effects (User-Triggered)

| Effect | Trigger | Description |
|--------|---------|-------------|
| Cursor Trail | Mouse movement | Neon pixel afterimages following cursor |
| Magnetic Buttons | Cursor proximity | Buttons pull toward cursor within 100px |
| RGB Split | Hover | Chromatic aberration on cards/badges |
| Glitch Text | Hover + Random intervals | Text skew, RGB split, clip-path slicing |

---

## Architecture

### New Components

```
src/components/effects/
├── crt-overlay.tsx       # Scan lines, flicker, screen curvature
├── noise-overlay.tsx     # Static/grain effect
├── particle-field.tsx    # Floating pixel particles (canvas)
├── cursor-trail.tsx      # Custom cursor with trailing pixels
├── glitch-text.tsx       # Text glitch wrapper component
├── magnetic-button.tsx   # Cursor-attracted button wrapper
├── rgb-split.tsx         # Chromatic aberration on hover
└── neon-pulse.tsx        # Pulsing glow animation wrapper
```

### Integration Map

| Component | Location | Wraps/Replaces |
|-----------|----------|----------------|
| `CRTOverlay` | Root layout | Fixed overlay |
| `NoiseOverlay` | Root layout | Fixed overlay |
| `ParticleField` | Root layout | Fixed background |
| `CursorTrail` | Root layout | Global cursor |
| `GlitchText` | Hero, section titles | Headings |
| `MagneticButton` | Hero CTAs, contact | Existing buttons |
| `RGBSplit` | Projects, skills | Cards, badges |
| `NeonPulse` | Timeline, social icons | Accent elements |

---

## Technical Specifications

### Noise Overlay
- SVG filter-based turbulence for performance
- Animated via CSS keyframes (baseFrequency shift)
- `pointer-events: none` to not block interactions
- Opacity: 0.05-0.08

### CRT Effects
- Scan lines: Repeating linear gradient (2px lines)
- Moving scan line: Pseudo-element animating top→bottom over 8s
- Flicker: Opacity keyframes (1 → 0.97 → 1) every 4-6s randomly
- Curvature: Subtle border-radius on viewport edges via pseudo-element

### Particle Field
- Canvas element, fixed position, z-index behind content
- Particle properties: x, y, size (2-6px), color (green/cyan/magenta), velocity
- Update loop via requestAnimationFrame
- Particles wrap around screen edges
- Count: 80 desktop, 40 mobile

### Cursor Trail
- Track mouse position in state
- Maintain array of last 10 positions
- Render as absolutely positioned divs or canvas
- Each segment: decreasing size (8px → 2px), decreasing opacity
- Disabled on touch devices (`pointer: coarse`)

### Glitch Text
- CSS keyframes for transform (skew, translate)
- Pseudo-elements for RGB split (::before red, ::after blue)
- Clip-path animation for "slice" effect
- Random trigger: setInterval with random delay (5000-10000ms)
- Hover trigger: immediate glitch on mouseenter

### Magnetic Button
- Track cursor position relative to button center
- Calculate distance, apply proportional transform
- Max displacement: 15px
- Detection radius: 100px
- Easing: ease-out on attract, elastic on release

### RGB Split (Chromatic Aberration)
- Wrapper component with relative position
- ::before and ::after pseudo-elements
- Before: mix-blend-mode with red shift left
- After: mix-blend-mode with blue shift right
- Offset: 2-3px on hover, 0 at rest
- Transition: 0.15s ease-out

### Neon Pulse
- CSS keyframes animating box-shadow
- Shadow expands/contracts: 0 0 5px → 0 0 20px → 0 0 5px
- Color matches accent (neon green)
- Duration: 2-3s, staggered start times via animation-delay

---

## Performance & Accessibility

### Performance
- Canvas effects use `requestAnimationFrame` with delta timing
- Particle count scales with viewport/device
- CSS animations use `transform` and `opacity` only (GPU accelerated)
- `will-change` applied sparingly to animated elements
- Noise uses SVG filter (hardware accelerated)

### Accessibility
- All effects respect `prefers-reduced-motion: reduce`
- Reduced motion: disable particles, trails, glitch, flicker
- Keep subtle scan lines and static for aesthetic
- Ensure text remains readable (contrast unaffected)
- Cursor trail doesn't replace system cursor (shows alongside)

---

## CSS Additions (globals.css)

```css
/* Keyframes */
@keyframes flicker { ... }
@keyframes scanline-move { ... }
@keyframes glitch { ... }
@keyframes neon-pulse { ... }
@keyframes noise { ... }

/* Utility classes */
.crt-screen { ... }
.neon-glow { ... }
.glitch-text { ... }
```

---

## Implementation Order

1. **Foundation:** CSS keyframes and utility classes in globals.css
2. **Overlays:** CRTOverlay, NoiseOverlay (visual layer)
3. **Background:** ParticleField (ambient motion)
4. **Cursor:** CursorTrail (interactive)
5. **Text:** GlitchText (applied to headings)
6. **Buttons:** MagneticButton (replace CTAs)
7. **Cards:** RGBSplit (wrap project cards, badges)
8. **Accents:** NeonPulse (timeline, icons)
9. **Polish:** Timing, intensity tuning, mobile optimization
10. **A11y:** prefers-reduced-motion handling

---

## Success Criteria

- Page feels alive with constant subtle motion
- Interactive elements respond dramatically to cursor
- Retro CRT/glitch aesthetic is unmistakable
- Performance stays smooth (60fps on modern devices)
- Respects user motion preferences
- Content remains readable and accessible
