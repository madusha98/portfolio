"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import cvData from "@/data/cv.json";

const skillCategories = [
	{ title: "Architecture & Leadership", skills: cvData.skills.architecture },
	{ title: "Frontend", skills: cvData.skills.frontend },
	{ title: "Backend", skills: cvData.skills.backend },
	{ title: "DevOps & Cloud", skills: cvData.skills.devops },
	{ title: "AI & ML", skills: cvData.skills.ai },
];

export function SkillsSection() {
	return (
		<section id="skills" className="border-t border-border px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<SectionHeader index="03" title="Skills" subtitle="The toolkit, honestly rated." />
				</ScrollReveal>

				<dl className="border-t border-border">
					{skillCategories.map((category, index) => (
						<ScrollReveal key={category.title} delay={index * 0.06}>
							<div className="grid gap-3 border-b border-border py-6 md:grid-cols-[14rem_1fr] md:gap-10">
								<dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
									{category.title}
								</dt>
								<dd className="flex flex-wrap gap-x-4 gap-y-2">
									{category.skills.map((skill) => (
										<span key={skill} className="font-mono text-sm text-muted-foreground">
											{skill}
										</span>
									))}
								</dd>
							</div>
						</ScrollReveal>
					))}
				</dl>
			</div>
		</section>
	);
}
