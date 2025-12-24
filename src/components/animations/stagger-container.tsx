"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface StaggerContainerProps {
	children: ReactNode;
	className?: string;
	staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: StaggerContainerProps) {
	const { ref, isIntersecting } = useIntersectionObserver({
		threshold: 0.1,
		triggerOnce: true,
	});

	const customVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: staggerDelay,
				delayChildren: 0.2,
			},
		},
	};

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={isIntersecting ? "visible" : "hidden"}
			variants={customVariants}
			className={className}
		>
			{children}
		</motion.div>
	);
}
