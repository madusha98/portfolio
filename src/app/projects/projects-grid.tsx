"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { StaggerContainer } from "@/components/animations/stagger-container";
import { ProjectCard } from "@/components/shared/project-card";
import { BackLink } from "@/components/shared/back-link";
import projectsData from "@/data/projects.json";

export function ProjectsGrid() {
	const projects = [...projectsData].sort((a, b) => a.order - b.order);

	return (
		<section className="min-h-screen px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<BackLink href="/">Home</BackLink>
				</ScrollReveal>

				<ScrollReveal>
					<SectionHeader
						title="All projects"
						subtitle="A collection of things I've built."
						className="mt-8"
					/>
				</ScrollReveal>

				<StaggerContainer className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
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
			</div>
		</section>
	);
}
