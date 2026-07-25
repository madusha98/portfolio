"use client";

import { useSyncExternalStore } from "react";

type PaintableCanvas = HTMLCanvasElement & { requestPaint?: () => void };
type ElementImageContext = CanvasRenderingContext2D & {
	drawElementImage?: (el: Element, x: number, y: number) => void;
};

const noopSubscribe = () => () => {};

function probe(): boolean {
	if (typeof document === "undefined") return false;
	const canvas = document.createElement("canvas") as PaintableCanvas;
	const ctx = canvas.getContext("2d") as ElementImageContext | null;
	return Boolean(
		ctx && typeof ctx.drawElementImage === "function" && typeof canvas.requestPaint === "function"
	);
}

/**
 * True when the browser exposes the HTML-in-Canvas API that every Canvas UI
 * page effect renders through. Server snapshot is `false` so SSR matches the
 * un-enhanced first paint and we don't trip a hydration mismatch.
 *
 * As of Chrome 148-150 this is origin-trial / flag gated
 * (chrome://flags/#canvas-draw-element). Firefox and Safari have not shipped it.
 */
export function useCanvasSupport(): boolean {
	return useSyncExternalStore(noopSubscribe, probe, () => false);
}
