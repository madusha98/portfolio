"use client";

import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { ReactNode } from "react";
import { Variants } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface ScrollRevealProps {
	children: ReactNode;
	variants?: Variants;
	className?: string;
	delay?: number;
}

export function ScrollReveal({ children, variants = fadeInUp, className, delay = 0 }: ScrollRevealProps) {
	const { ref, isIntersecting } = useIntersectionObserver({
		threshold: 0.1,
		triggerOnce: true,
	});

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={isIntersecting ? "visible" : "hidden"}
			variants={variants}
			transition={{ delay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
