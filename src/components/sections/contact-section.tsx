"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ContactForm } from "@/components/shared/contact-form";
import { Github, Linkedin } from "lucide-react";
import cvData from "@/data/cv.json";

const { email, phone, location, socials } = cvData.personal;

const channels = [
	{ label: "email", value: email, href: `mailto:${email}` },
	{ label: "phone", value: phone, href: `tel:${phone}` },
	{ label: "based", value: location, href: null },
];

export function ContactSection() {
	return (
		<section id="contact" className="border-t border-border px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<SectionHeader
						index="05"
						title="Contact"
						subtitle="Got something to build? Let's talk."
					/>
				</ScrollReveal>

				<div className="grid gap-12 md:grid-cols-2 md:gap-16">
					<ScrollReveal>
						<p className="text-base leading-relaxed text-muted-foreground">
							I&apos;m always interested in new opportunities, collaborations, and
							interesting problems. Questions welcome too.
						</p>

						<dl className="mt-8 border-t border-border font-mono text-sm">
							{channels.map((channel) => (
								<div
									key={channel.label}
									className="flex flex-col gap-1 border-b border-border py-4"
								>
									<dt className="text-[11px] uppercase tracking-[0.15em] text-accent">
										{channel.label}
									</dt>
									<dd>
										{channel.href ? (
											<a
												href={channel.href}
												className="transition-colors hover:text-accent"
											>
												{channel.value}
											</a>
										) : (
											channel.value
										)}
									</dd>
								</div>
							))}
						</dl>

						<div className="mt-8 flex gap-3">
							{socials.github && (
								<a
									href={socials.github}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="GitHub"
									className="hairline hairline-hover p-3 transition-colors hover:text-accent"
								>
									<Github className="h-4 w-4" />
								</a>
							)}
							{socials.linkedin && (
								<a
									href={socials.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="LinkedIn"
									className="hairline hairline-hover p-3 transition-colors hover:text-accent"
								>
									<Linkedin className="h-4 w-4" />
								</a>
							)}
						</div>
					</ScrollReveal>

					<ScrollReveal delay={0.15}>
						<ContactForm />
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}
