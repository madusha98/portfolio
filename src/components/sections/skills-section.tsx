"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SkillBadge } from "@/components/shared/skill-badge";
import { StaggerContainer } from "@/components/animations/stagger-container";
import cvData from "@/data/cv.json";

export function SkillsSection() {
	const skillCategories = [
		{ title: "Architecture & Leadership", skills: cvData.skills.architecture },
		{ title: "Frontend", skills: cvData.skills.frontend },
		{ title: "Backend", skills: cvData.skills.backend },
		{ title: "DevOps & Cloud", skills: cvData.skills.devops },
		{ title: "AI & ML", skills: cvData.skills.ai },
	];

	return (
		<section id="skills" className="py-20 px-4">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<SectionHeader title="Skills" subtitle="Technologies & expertise" />
				</ScrollReveal>

				<div className="space-y-8">
					{skillCategories.map((category, index) => (
						<ScrollReveal key={category.title} delay={index * 0.1}>
							<div>
								<h3 className="font-mono text-xl font-bold mb-4 flex items-center gap-2">
									<span className="text-accent">◆</span>
									{category.title}
								</h3>
								<StaggerContainer className="flex flex-wrap gap-3">
									{category.skills.map((skill) => (
										<SkillBadge key={skill} skill={skill} />
									))}
								</StaggerContainer>
							</div>
						</ScrollReveal>
					))}
				</div>
			</div>
		</section>
	);
}
