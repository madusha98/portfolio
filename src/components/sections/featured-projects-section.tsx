"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { StaggerContainer } from "@/components/animations/stagger-container";
import { ProjectCard } from "@/components/shared/project-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import projectsData from "@/data/projects.json";

export function FeaturedProjectsSection() {
	const featuredProjects = projectsData
		.filter((project) => project.featured)
		.sort((a, b) => a.order - b.order);

	return (
		<section id="projects" className="border-t border-border px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<SectionHeader
						index="04"
						title="Selected work"
						subtitle="A few things worth showing."
					/>
				</ScrollReveal>

				<StaggerContainer className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
					{featuredProjects.map((project) => (
						<ProjectCard
							key={project.id}
							slug={project.slug}
							title={project.title}
							tagline={project.tagline}
							description={project.description}
							technologies={project.technologies}
							year={project.year}
							category={project.category}
						/>
					))}
				</StaggerContainer>

				<ScrollReveal delay={0.2}>
					<Link
						href="/projects"
						className="group mt-10 inline-flex items-center gap-2 font-mono text-sm text-accent"
					>
						View all projects
						<ArrowRight
							className="h-4 w-4 transition-transform group-hover:translate-x-1"
							aria-hidden
						/>
					</Link>
				</ScrollReveal>
			</div>
		</section>
	);
}
