import { Github, Linkedin, Mail } from "lucide-react";
import cvData from "@/data/cv.json";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t-2 border-foreground bg-background py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="font-mono text-sm text-muted">
						© {currentYear} {cvData.personal.name}. Built with Next.js & Tailwind CSS.
					</div>

					<div className="flex items-center gap-4">
						{cvData.personal.socials.github && (
							<a
								href={cvData.personal.socials.github}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-accent transition-colors"
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
								className="hover:text-accent transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin className="h-5 w-5" />
							</a>
						)}
						<a
							href={`mailto:${cvData.personal.email}`}
							className="hover:text-accent transition-colors"
							aria-label="Email"
						>
							<Mail className="h-5 w-5" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
