"use client";

import type { ComponentType, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCanvasSupport } from "./use-canvas-support";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

type EffectComponent = ComponentType<{
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}>;

interface EffectProps {
	effect: EffectComponent;
	children: ReactNode;
	className?: string;
	/**
	 * Only mount the effect while it is on screen. Browsers cap live WebGL
	 * contexts (~16 in Chrome); the /effects gallery alone declares 22.
	 */
	lazy?: boolean;
}

/**
 * Gate for every Canvas UI effect. Handles the two ways the raw components
 * misbehave outside a fixed-size demo box:
 *
 * 1. They build a WebGL context and paint an absolutely-positioned output
 *    canvas over their children *even when HTML-in-Canvas is unavailable*, so
 *    the empty source texture can cover the content instead of no-opping.
 *    Unsupported browsers therefore never mount the effect at all.
 *
 * 2. When the API *is* available the children move inside an absolutely
 *    positioned <canvas>, leaving the wrapper with no in-flow content. Any
 *    auto-height container collapses to zero. The invisible spacer below
 *    re-establishes the natural height; `visibility: hidden` keeps it out of
 *    the tab order and the accessibility tree.
 */
export function Effect({ effect: Component, children, className, lazy = false }: EffectProps) {
	const supported = useCanvasSupport();
	const { ref, isIntersecting } = useIntersectionObserver({
		threshold: 0,
		triggerOnce: false,
		rootMargin: "200px",
	});

	const active = supported && (!lazy || isIntersecting);

	if (!active) {
		return (
			<div ref={ref} className={className}>
				{children}
			</div>
		);
	}

	return (
		<div ref={ref} className={cn("relative", className)}>
			<div className="invisible" aria-hidden>
				{children}
			</div>
			{/* The effect components hard-set `position: relative` inline, which
			    beats any utility class — so the overlay has to be inline too.
			    Their JSX spreads `...style` after it, so this wins. */}
			<Component style={{ position: "absolute", inset: 0 }}>{children}</Component>
		</div>
	);
}
