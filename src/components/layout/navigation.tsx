"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/data/site-config.json";

const linkClass =
	"font-mono text-xs tracking-wide transition-colors hover:text-accent text-muted-foreground";

export function Navigation() {
	const { scrollToSection } = useSmoothScroll();
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	const sectionIds = ["home", "about", "experience", "skills", "contact"];
	const activeSection = useScrollSpy(sectionIds);

	const handleNavClick = (href: string) => {
		const sectionId = href.replace("/#", "");
		if (isHomePage) {
			scrollToSection(sectionId);
		} else {
			window.location.href = href;
		}
	};

	return (
		<nav className="flex items-center gap-7">
			{siteConfig.navigation.map((item) => {
				const isAnchorLink = item.href.startsWith("/#");
				const isActive = isAnchorLink
					? isHomePage && activeSection === item.href.replace("/#", "")
					: pathname === item.href;

				const content = (
					<>
						{item.label}
						<span
							className={cn(
								"absolute -bottom-1.5 left-0 h-px bg-accent transition-all",
								isActive ? "w-full" : "w-0"
							)}
							aria-hidden
						/>
					</>
				);

				return isAnchorLink ? (
					<button
						key={item.href}
						onClick={() => handleNavClick(item.href)}
						aria-current={isActive ? "true" : undefined}
						className={cn(linkClass, "relative", isActive && "text-accent")}
					>
						{content}
					</button>
				) : (
					<Link
						key={item.href}
						href={item.href}
						aria-current={isActive ? "page" : undefined}
						className={cn(linkClass, "relative", isActive && "text-accent")}
					>
						{content}
					</Link>
				);
			})}
		</nav>
	);
}
