"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Zap, Lightbulb, Target } from "lucide-react";
import Link from "next/link";
import { GlitchText } from "@/components/effects";

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
	return (
		<section className="py-20 px-4 min-h-screen">
			<div className="container mx-auto max-w-4xl">
				{/* Back navigation */}
				<ScrollReveal>
					<Link href="/projects">
						<Button
							variant="ghost"
							className="mb-8 font-mono hover:text-accent transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Projects
						</Button>
					</Link>
				</ScrollReveal>

				{/* Header */}
				<ScrollReveal>
					<div className="mb-12">
						<div className="flex flex-wrap items-center gap-3 mb-4">
							<Badge variant="outline" className="font-mono">
								{project.year}
							</Badge>
							<Badge variant="secondary">{project.category}</Badge>
						</div>
						<h1 className="font-mono text-3xl md:text-5xl font-bold mb-3">
							<span className="text-accent">&gt;</span>{" "}
							<GlitchText glitchOnHover={true} randomGlitch={false}>
								{project.title}
							</GlitchText>
						</h1>
						<p className="text-muted-foreground text-lg md:text-xl">
							{project.tagline}
						</p>
						<div className="h-1 w-20 bg-accent mt-4" />
					</div>
				</ScrollReveal>

				{/* Description */}
				<ScrollReveal>
					<p className="text-muted-foreground leading-relaxed mb-12 text-base md:text-lg">
						{project.description}
					</p>
				</ScrollReveal>

				{/* Tech stack */}
				<ScrollReveal>
					<div className="mb-12">
						<h2 className="font-mono text-sm text-accent mb-3 uppercase tracking-wider">
							Tech Stack
						</h2>
						<div className="flex flex-wrap gap-2">
							{project.technologies.map((tech) => (
								<Badge
									key={tech}
									variant="outline"
									className="font-mono text-sm pixel-border"
								>
									{tech}
								</Badge>
							))}
						</div>
					</div>
				</ScrollReveal>

				{/* Case study sections */}
				<div className="space-y-6">
					<ScrollReveal>
						<Card className="pixel-border">
							<CardHeader>
								<CardTitle className="font-mono flex items-center gap-2">
									<Target className="h-5 w-5 text-accent" />
									<GlitchText glitchOnHover={true} randomGlitch={false}>
										Challenge
									</GlitchText>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">
									{project.challenge}
								</p>
							</CardContent>
						</Card>
					</ScrollReveal>

					<ScrollReveal delay={0.1}>
						<Card className="pixel-border">
							<CardHeader>
								<CardTitle className="font-mono flex items-center gap-2">
									<Lightbulb className="h-5 w-5 text-accent" />
									<GlitchText glitchOnHover={true} randomGlitch={false}>
										Solution
									</GlitchText>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">
									{project.solution}
								</p>
							</CardContent>
						</Card>
					</ScrollReveal>

					<ScrollReveal delay={0.2}>
						<Card className="pixel-border">
							<CardHeader>
								<CardTitle className="font-mono flex items-center gap-2">
									<Zap className="h-5 w-5 text-accent" />
									<GlitchText glitchOnHover={true} randomGlitch={false}>
										Impact
									</GlitchText>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">
									{project.impact}
								</p>
							</CardContent>
						</Card>
					</ScrollReveal>
				</div>

				{/* Links */}
				{Object.values(project.links).some(Boolean) && (
					<ScrollReveal delay={0.3}>
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
												className="pixel-border font-mono hover:text-accent transition-colors"
											>
												{label.charAt(0).toUpperCase() + label.slice(1)}
												<ExternalLink className="ml-2 h-4 w-4" />
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
