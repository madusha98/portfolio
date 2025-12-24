"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ContactForm } from "@/components/shared/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, Github, MapPin, Phone } from "lucide-react";
import cvData from "@/data/cv.json";

export function ContactSection() {
	return (
		<section id="contact" className="py-20 px-4 bg-card">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<SectionHeader title="Get In Touch" subtitle="Let's work together" />
				</ScrollReveal>

				<div className="grid md:grid-cols-2 gap-12">
					<ScrollReveal>
						<div>
							<p className="text-lg text-muted-foreground mb-8">
								I&apos;m always interested in new opportunities, collaborations, and exciting projects.
								Whether you have a question or just want to say hi, feel free to reach out!
							</p>

							<div className="space-y-4">
								<Card className="pixel-border">
									<CardContent className="pt-6">
										<div className="flex items-center gap-3">
											<Mail className="h-5 w-5 text-accent" />
											<div>
												<div className="font-mono text-sm text-muted">Email</div>
												<a
													href={`mailto:${cvData.personal.email}`}
													className="hover:text-accent transition-colors"
												>
													{cvData.personal.email}
												</a>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="pixel-border">
									<CardContent className="pt-6">
										<div className="flex items-center gap-3">
											<Phone className="h-5 w-5 text-accent" />
											<div>
												<div className="font-mono text-sm text-muted">Phone</div>
												<a
													href={`tel:${cvData.personal.phone}`}
													className="hover:text-accent transition-colors"
												>
													{cvData.personal.phone}
												</a>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="pixel-border">
									<CardContent className="pt-6">
										<div className="flex items-center gap-3">
											<MapPin className="h-5 w-5 text-accent" />
											<div>
												<div className="font-mono text-sm text-muted">Location</div>
												<div>{cvData.personal.location}</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<div className="flex gap-4 pt-4">
									{cvData.personal.socials.github && (
										<a
											href={cvData.personal.socials.github}
											target="_blank"
											rel="noopener noreferrer"
											className="p-3 pixel-border hover:bg-accent hover:text-background transition-colors"
											aria-label="GitHub"
										>
											<Github className="h-5 w-5" />
										</a>
									)}
									{cvData.personal.socials.linkedin && (
										<a
											href={cvData.personal.socials.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="p-3 pixel-border hover:bg-accent hover:text-background transition-colors"
											aria-label="LinkedIn"
										>
											<Linkedin className="h-5 w-5" />
										</a>
									)}
								</div>
							</div>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={0.2}>
						<ContactForm />
					</ScrollReveal>
				</div>
			</div>
		</section>
	);
}
