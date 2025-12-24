"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/data/site-config.json";

export function Navigation() {
	const { scrollToSection } = useSmoothScroll();
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	const sectionIds = ["home", "about", "experience", "skills", "contact"];
	const activeSection = useScrollSpy(sectionIds);

	const handleNavClick = (href: string) => {
		if (href.startsWith("/#")) {
			const sectionId = href.replace("/#", "");
			if (isHomePage) {
				scrollToSection(sectionId);
			} else {
				window.location.href = href;
			}
		}
	};

	return (
		<nav className="flex items-center gap-6">
			{siteConfig.navigation.map((item) => {
				const isAnchorLink = item.href.startsWith("/#");
				const sectionId = isAnchorLink ? item.href.replace("/#", "") : "";
				const isActive = isAnchorLink
					? isHomePage && activeSection === sectionId
					: pathname === item.href;

				if (isAnchorLink) {
					return (
						<button
							key={item.href}
							onClick={() => handleNavClick(item.href)}
							className={cn(
								"font-mono text-sm hover:text-accent transition-colors relative",
								isActive && "text-accent"
							)}
						>
							{item.label}
							{isActive && (
								<span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent" />
							)}
						</button>
					);
				}

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"font-mono text-sm hover:text-accent transition-colors relative",
							isActive && "text-accent"
						)}
					>
						{item.label}
						{isActive && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent" />}
					</Link>
				);
			})}
		</nav>
	);
}
