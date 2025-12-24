"use client";

import { ReactNode } from "react";
import { StaggerContainer } from "@/components/animations/stagger-container";

interface TimelineProps {
	children: ReactNode;
}

export function Timeline({ children }: TimelineProps) {
	return (
		<StaggerContainer className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border md:before:ml-[8.75rem]">
			{children}
		</StaggerContainer>
	);
}
