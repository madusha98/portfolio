"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import projectsData from "@/data/projects.json";
import { motion } from "framer-motion";
import { RGBSplit, GlitchText } from "@/components/effects";

export function ProjectsGrid() {
	return (
		<section className="py-20 px-4 min-h-screen">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<Link href="/">
						<Button
							variant="ghost"
							className="mb-8 font-mono hover:text-accent transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</Link>
				</ScrollReveal>

				<ScrollReveal>
					<SectionHeader
						title="All Projects"
						subtitle="A collection of things I've built"
					/>
				</ScrollReveal>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...projectsData].sort((a, b) => a.order - b.order).map((project, index) => (
						<ScrollReveal key={project.id} delay={index * 0.1}>
							<RGBSplit>
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
											<CardTitle className="font-mono">
												<GlitchText glitchOnHover={true} randomGlitch={false}>
													{project.title}
												</GlitchText>
											</CardTitle>
											<CardDescription>{project.tagline}</CardDescription>
										</CardHeader>
										<CardContent className="flex-1 flex flex-col">
											<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
												{project.description}
											</p>

											<div className="flex flex-wrap gap-2 mb-4">
												{project.technologies.slice(0, 3).map((tech) => (
													<Badge
														key={tech}
														variant="outline"
														className="text-xs"
													>
														{tech}
													</Badge>
												))}
												{project.technologies.length > 3 && (
													<Badge variant="outline" className="text-xs">
														+{project.technologies.length - 3}
													</Badge>
												)}
											</div>

											<Link
												href={`/projects/${project.slug}`}
												className="mt-auto"
											>
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
							</RGBSplit>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	);
}
