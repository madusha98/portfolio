"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { staggerItem } from "@/lib/animations";

interface ProjectCardProps {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	technologies: string[];
	year: string;
	category: string;
}

export function ProjectCard({
	slug,
	title,
	tagline,
	description,
	technologies,
	year,
	category,
}: ProjectCardProps) {
	return (
		<motion.div variants={staggerItem} className="h-full">
			<Link
				href={`/projects/${slug}`}
				className="hairline hairline-hover group flex h-full flex-col p-6"
			>
				<div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
					<span>{year}</span>
					<span>{category}</span>
				</div>

				<h3 className="mt-5 flex items-start gap-2 font-mono text-lg font-bold tracking-tight transition-colors group-hover:text-accent">
					{title}
					<ArrowUpRight
						className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
						aria-hidden
					/>
				</h3>
				<p className="mt-1 text-sm text-muted-foreground">{tagline}</p>

				<p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>

				<ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-6">
					{technologies.slice(0, 4).map((tech) => (
						<li key={tech} className="font-mono text-[11px] text-muted-foreground">
							{tech}
						</li>
					))}
					{technologies.length > 4 && (
						<li className="font-mono text-[11px] text-accent">
							+{technologies.length - 4}
						</li>
					)}
				</ul>
			</Link>
		</motion.div>
	);
}
