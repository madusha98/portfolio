"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import cvData from "@/data/cv.json";
import { calculateYearsDiff } from "@/lib/utils";

export function AboutSection() {
	const yearsOfExperience = calculateYearsDiff("2018-10");
	const totalProjects = 15; // Based on CV projects
	const photosTaken = "1000+"; // Placeholder

	return (
		<section id="about" className="py-20 px-4">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<SectionHeader title="About Me" subtitle="Get to know me better" />
				</ScrollReveal>

				<div className="grid md:grid-cols-3 gap-8">
					<ScrollReveal className="md:col-span-2">
						<div className="space-y-4 text-lg text-muted-foreground">
							<p>{cvData.personal.bio}</p>
							<p>
								Beyond code, I&apos;m passionate about photography and travel. I believe that both software
								engineering and photography share a common goal: capturing moments and creating
								experiences that matter.
							</p>
							<p>
								When I&apos;m not architecting systems or writing code, you&apos;ll find me exploring new places
								with my camera, seeking the perfect shot that tells a story.
							</p>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={0.2}>
						<div className="space-y-4">
							<Card className="pixel-border">
								<CardContent className="pt-6">
									<div className="text-center">
										<div className="font-mono text-4xl font-bold text-accent mb-2">
											{yearsOfExperience}+
										</div>
										<div className="text-sm text-muted">Years Experience</div>
									</div>
								</CardContent>
							</Card>

							<Card className="pixel-border">
								<CardContent className="pt-6">
									<div className="text-center">
										<div className="font-mono text-4xl font-bold text-accent mb-2">
											{totalProjects}+
										</div>
										<div className="text-sm text-muted">Projects Completed</div>
									</div>
								</CardContent>
							</Card>

							<Card className="pixel-border">
								<CardContent className="pt-6">
									<div className="text-center">
										<div className="font-mono text-4xl font-bold text-accent mb-2">
											{photosTaken}
										</div>
										<div className="text-sm text-muted">Photos Captured</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}
