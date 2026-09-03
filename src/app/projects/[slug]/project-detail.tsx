"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { BackLink } from "@/components/shared/back-link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Project {
	id: string;
	slug: string;
	title: string;
	tagline: string;
	description: string;
	featured: boolean;
	image: string;
	images: string[];
	technologies: string[];
	links: Record<string, string | undefined>;
	year: string;
	category: string;
	challenge: string;
	solution: string;
	impact: string;
}

export function ProjectDetail({ project }: { project: Project }) {
	const caseStudy = [
		{ label: "Challenge", body: project.challenge },
		{ label: "Solution", body: project.solution },
		{ label: "Impact", body: project.impact },
	].filter((entry) => entry.body);

	return (
		<section className="min-h-screen px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-3xl">
				<ScrollReveal>
					<BackLink href="/projects">Projects</BackLink>
				</ScrollReveal>

				<ScrollReveal>
					<header className="mt-8 mb-12 border-b border-border pb-8">
						<div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
							<span>{project.year}</span>
							<span className="rule" />
							<span>{project.category}</span>
						</div>
						<h1 className="mt-5 text-balance font-mono text-3xl font-bold tracking-tight md:text-4xl">
							{project.title}
						</h1>
						<p className="mt-3 text-lg text-muted-foreground">{project.tagline}</p>
					</header>
				</ScrollReveal>

				<ScrollReveal>
					<p className="text-base leading-relaxed text-muted-foreground">
						{project.description}
					</p>
				</ScrollReveal>

				<ScrollReveal>
					<div className="mt-12">
						<h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
							Tech stack
						</h2>
						<ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
							{project.technologies.map((tech) => (
								<li key={tech} className="font-mono text-sm text-muted-foreground">
									{tech}
								</li>
							))}
						</ul>
					</div>
				</ScrollReveal>

				<dl className="mt-12 border-t border-border">
					{caseStudy.map((entry, index) => (
						<ScrollReveal key={entry.label} delay={index * 0.1}>
							<div className="grid gap-3 border-b border-border py-8 md:grid-cols-[10rem_1fr] md:gap-10">
								<dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
									{entry.label}
								</dt>
								<dd className="text-sm leading-relaxed text-muted-foreground">
									{entry.body}
								</dd>
							</div>
						</ScrollReveal>
					))}
				</dl>

				{Object.values(project.links).some(Boolean) && (
					<ScrollReveal delay={0.2}>
						<div className="mt-12 flex flex-wrap gap-4">
							{Object.entries(project.links).map(
								([label, url]) =>
									url && (
										<a
											key={label}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												variant="outline"
												className="key rounded-none font-mono"
											>
												{label.charAt(0).toUpperCase() + label.slice(1)}
												<ExternalLink className="ml-2 h-4 w-4" aria-hidden />
											</Button>
										</a>
									)
							)}
						</div>
					</ScrollReveal>
				)}
			</div>
		</section>
	);
}
