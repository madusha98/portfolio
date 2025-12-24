"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import { formatDateRange } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TimelineItemProps {
	company: string;
	position: string;
	location: string;
	startDate: string;
	endDate: string | null;
	current: boolean;
	achievements: string[];
	technologies: string[];
}

export function TimelineItem({
	company,
	position,
	location,
	startDate,
	endDate,
	current,
	achievements,
	technologies,
}: TimelineItemProps) {
	return (
		<motion.div variants={staggerItem} className="relative flex gap-6 pb-8">
			{/* Timeline dot */}
			<div className="flex flex-col items-center">
				<div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-background">
					<div className="h-3 w-3 rounded-full bg-accent" />
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 md:flex md:gap-6">
				<div className="mb-4 md:mb-0 md:w-36 md:text-right">
					<time className="font-mono text-sm text-muted">{formatDateRange(startDate, endDate)}</time>
					{current && (
						<Badge variant="outline" className="mt-2 pixel-border-accent text-accent border-accent">
							Current
						</Badge>
					)}
				</div>

				<div className="flex-1">
					<h3 className="font-mono text-xl font-bold mb-1">{position}</h3>
					<div className="text-muted mb-2">
						{company} • {location}
					</div>

					<ul className="space-y-2 mb-4">
						{achievements.map((achievement, index) => (
							<li key={index} className="text-sm text-muted-foreground flex gap-2">
								<span className="text-accent mt-1">▹</span>
								<span>{achievement}</span>
							</li>
						))}
					</ul>

					<div className="flex flex-wrap gap-2">
						{technologies.slice(0, 5).map((tech) => (
							<Badge key={tech} variant="secondary" className="text-xs">
								{tech}
							</Badge>
						))}
						{technologies.length > 5 && (
							<Badge variant="secondary" className="text-xs">
								+{technologies.length - 5} more
							</Badge>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
