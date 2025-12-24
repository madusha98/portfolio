"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
	threshold?: number;
	root?: Element | null;
	rootMargin?: string;
	triggerOnce?: boolean;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
	const { threshold = 0.1, root = null, rootMargin = "0px", triggerOnce = true } = options;

	const ref = useRef<HTMLDivElement>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsIntersecting(true);
					if (triggerOnce) {
						observer.unobserve(element);
					}
				} else if (!triggerOnce) {
					setIsIntersecting(false);
				}
			},
			{
				threshold,
				root,
				rootMargin,
			}
		);

		observer.observe(element);

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [threshold, root, rootMargin, triggerOnce]);

	return { ref, isIntersecting };
}
