"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";

interface SkillBadgeProps {
	skill: string;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
	return (
		<motion.div variants={staggerItem}>
			<Badge
				variant="outline"
				className="pixel-border font-mono hover:bg-accent hover:text-background transition-colors cursor-default"
			>
				{skill}
			</Badge>
		</motion.div>
	);
}
