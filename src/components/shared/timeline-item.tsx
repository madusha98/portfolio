"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import { formatDateRange } from "@/lib/utils";

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
		<motion.article
			variants={staggerItem}
			className="group grid gap-4 border-b border-border py-8 md:grid-cols-[10rem_1fr] md:gap-10"
		>
			<div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-2">
				<time className="font-mono text-sm text-muted-foreground">
					{formatDateRange(startDate, endDate)}
				</time>
				{current && (
					<span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
						<span className="h-1.5 w-1.5 bg-accent" aria-hidden />
						Current
					</span>
				)}
			</div>

			<div>
				<h3 className="font-mono text-lg font-bold tracking-tight transition-colors group-hover:text-accent">
					{position}
				</h3>
				<p className="mt-1 font-mono text-sm text-muted-foreground">
					{company} · {location}
				</p>

				<ul className="mt-5 space-y-2.5">
					{achievements.map((achievement) => (
						<li
							key={achievement}
							className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
						>
							<span className="mt-[0.4em] h-1 w-1 shrink-0 bg-accent" aria-hidden />
							<span>{achievement}</span>
						</li>
					))}
				</ul>

				<ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
					{technologies.map((tech) => (
						<li key={tech} className="font-mono text-[11px] text-muted-foreground">
							{tech}
						</li>
					))}
				</ul>
			</div>
		</motion.article>
	);
}
