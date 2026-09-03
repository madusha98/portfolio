"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import cvData from "@/data/cv.json";

const facts = [
	{ key: "role", value: cvData.personal.title },
	{ key: "based", value: cvData.personal.location },
	{ key: "focus", value: "Mobile · Backend · Cloud architecture" },
	{ key: "also", value: "Photography" },
];

export function AboutSection() {
	return (
		<section id="about" className="px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<SectionHeader index="01" title="About" subtitle="Who's behind the terminal." />
				</ScrollReveal>

				<div className="grid gap-12 md:grid-cols-5 md:gap-16">
					<ScrollReveal className="md:col-span-3">
						<div className="space-y-5 text-base leading-relaxed text-muted-foreground">
							<p>{cvData.personal.bio}</p>
							<p>
								I thrive on solving complex technical challenges and building systems that
								scale. From mobile apps to cloud infrastructure, I enjoy the full spectrum of
								software development.
							</p>
							<p>
								My approach combines technical excellence with pragmatic problem-solving —
								always focusing on delivering value while keeping code quality and system
								reliability intact.
							</p>
							<p>
								Outside of work, I&apos;m a hobbyist photographer exploring the world through
								my lens, one frame at a time.
							</p>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={0.15} className="md:col-span-2">
						<dl className="font-mono text-sm">
							{facts.map((fact) => (
								<div
									key={fact.key}
									className="flex flex-col gap-1 border-b border-border py-4 first:pt-0"
								>
									<dt className="text-[11px] uppercase tracking-[0.15em] text-accent">
										{fact.key}
									</dt>
									<dd className="text-foreground">{fact.value}</dd>
								</div>
							))}
						</dl>
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}
