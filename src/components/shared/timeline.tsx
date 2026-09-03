"use client";

import { ReactNode } from "react";
import { StaggerContainer } from "@/components/animations/stagger-container";

export function Timeline({ children }: { children: ReactNode }) {
	return <StaggerContainer className="border-t border-border">{children}</StaggerContainer>;
}
