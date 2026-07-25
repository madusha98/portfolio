import { Github, Linkedin, Mail } from "lucide-react";
import cvData from "@/data/cv.json";

const { socials, email, name } = cvData.personal;

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border px-6 py-10 md:px-10">
			<div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
				<p className="font-mono text-xs text-muted-foreground">
					<span className="text-accent">$</span> © {currentYear} {name}
				</p>

				<div className="flex items-center gap-5 text-muted-foreground">
					{socials.github && (
						<a
							href={socials.github}
							target="_blank"
							rel="noopener noreferrer"
							className="transition-colors hover:text-accent"
							aria-label="GitHub"
						>
							<Github className="h-4 w-4" />
						</a>
					)}
					{socials.linkedin && (
						<a
							href={socials.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="transition-colors hover:text-accent"
							aria-label="LinkedIn"
						>
							<Linkedin className="h-4 w-4" />
						</a>
					)}
					<a
						href={`mailto:${email}`}
						className="transition-colors hover:text-accent"
						aria-label="Email"
					>
						<Mail className="h-4 w-4" />
					</a>
				</div>
			</div>
		</footer>
	);
}
