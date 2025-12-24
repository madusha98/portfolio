"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Timeline } from "@/components/shared/timeline";
import { TimelineItem } from "@/components/shared/timeline-item";
import cvData from "@/data/cv.json";

export function ExperienceSection() {
	// Show only the first 5 most recent experiences
	const recentExperience = cvData.experience.slice(0, 5);

	return (
		<section id="experience" className="py-20 px-4 bg-card">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<SectionHeader title="Experience" subtitle="My professional journey" />
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

				{cvData.experience.length > 5 && (
					<ScrollReveal delay={0.3} className="text-center mt-8">
						<p className="text-muted text-sm">
							+ {cvData.experience.length - 5} more experiences in my career journey
						</p>
					</ScrollReveal>
				)}
			</div>
		</section>
	);
}
