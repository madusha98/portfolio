"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Timeline } from "@/components/shared/timeline";
import { TimelineItem } from "@/components/shared/timeline-item";
import cvData from "@/data/cv.json";

export function ExperienceSection() {
	const recentExperience = cvData.experience.slice(0, 5);
	const remaining = cvData.experience.length - recentExperience.length;

	return (
		<section id="experience" className="border-t border-border px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<SectionHeader
						index="02"
						title="Experience"
						subtitle="Seven years of shipping, scaling, and leading."
					/>
				</ScrollReveal>

				<Timeline>
					{recentExperience.map((exp) => (
						<TimelineItem
							key={exp.id}
							company={exp.company}
							position={exp.position}
							location={exp.location}
							startDate={exp.startDate}
							endDate={exp.endDate}
							current={exp.current}
							achievements={exp.achievements}
							technologies={exp.technologies}
						/>
					))}
				</Timeline>

				{remaining > 0 && (
					<ScrollReveal delay={0.2}>
						<p className="mt-8 font-mono text-sm text-muted-foreground">
							<span className="text-accent">+</span> {remaining} earlier roles
						</p>
					</ScrollReveal>
				)}
			</div>
		</section>
	);
}
