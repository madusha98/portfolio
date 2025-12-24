"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import projectsData from "@/data/projects.json";
import { motion } from "framer-motion";

export function FeaturedProjectsSection() {
	const featuredProjects = projectsData.filter((project) => project.featured);

	return (
		<section className="py-20 px-4 bg-card">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<SectionHeader title="Featured Projects" subtitle="Highlights from my work" />
				</ScrollReveal>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{featuredProjects.map((project, index) => (
						<ScrollReveal key={project.id} delay={index * 0.1}>
							<motion.div whileHover="hover" initial="rest">
								<Card className="pixel-border h-full flex flex-col">
									<CardHeader>
										<div className="flex items-start justify-between mb-2">
											<Badge variant="outline" className="font-mono">
												{project.year}
											</Badge>
											<Badge variant="secondary" className="text-xs">
												{project.category}
											</Badge>
										</div>
										<CardTitle className="font-mono">{project.title}</CardTitle>
										<CardDescription>{project.tagline}</CardDescription>
									</CardHeader>
									<CardContent className="flex-1 flex flex-col">
										<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
											{project.description}
										</p>

										<div className="flex flex-wrap gap-2 mb-4">
											{project.technologies.slice(0, 3).map((tech) => (
												<Badge key={tech} variant="outline" className="text-xs">
													{tech}
												</Badge>
											))}
											{project.technologies.length > 3 && (
												<Badge variant="outline" className="text-xs">
													+{project.technologies.length - 3}
												</Badge>
											)}
										</div>

										<Link href={`/projects/${project.slug}`} className="mt-auto">
											<Button
												variant="ghost"
												className="w-full group hover:text-accent transition-colors"
											>
												View Details
												<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
											</Button>
										</Link>
									</CardContent>
								</Card>
							</motion.div>
						</ScrollReveal>
					))}
				</div>

				<ScrollReveal delay={0.3} className="text-center mt-12">
					<Link href="/projects">
						<Button variant="outline" className="pixel-border font-mono" size="lg">
							View All Projects
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</ScrollReveal>
			</div>
		</section>
	);
}
