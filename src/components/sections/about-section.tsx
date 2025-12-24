"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import cvData from "@/data/cv.json";
import { calculateYearsDiff } from "@/lib/utils";

export function AboutSection() {
	const yearsOfExperience = calculateYearsDiff("2018-10");
	const totalProjects = 15; // Based on CV projects
	const teamSize = "10+"; // Led teams with 10+ members

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
								I thrive on solving complex technical challenges and building systems that scale. From mobile apps
								to cloud infrastructure, I enjoy the full spectrum of software development.
							</p>
							<p>
								My approach combines technical excellence with pragmatic problem-solving, always focusing on
								delivering value while maintaining code quality and system reliability.
							</p>
							<p className="text-base">
								Outside of work, I&apos;m a hobbyist photographer exploring the world through my lens, one frame at a time.
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
											{teamSize}
										</div>
										<div className="text-sm text-muted">Members in Teams Led</div>
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
