"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/data/site-config.json";

export function MobileMenu() {
	const [open, setOpen] = useState(false);
	const { scrollToSection } = useSmoothScroll();
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	const handleNavClick = (href: string) => {
		setOpen(false);

		if (href.startsWith("/#")) {
			const sectionId = href.replace("/#", "");
			if (isHomePage) {
				setTimeout(() => scrollToSection(sectionId), 100);
			} else {
				window.location.href = href;
			}
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="pixel-border">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-72 sm:w-80 p-0">
				<SheetHeader className="px-6 pt-6 pb-4 border-b-2 border-foreground">
					<SheetTitle className="font-mono text-left text-xl">Menu</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 p-6">
					{siteConfig.navigation.map((item) => {
						const isAnchorLink = item.href.startsWith("/#");

						if (isAnchorLink) {
							return (
								<button
									key={item.href}
									onClick={() => handleNavClick(item.href)}
									className="font-mono text-base hover:text-accent transition-colors text-left py-3 px-4 hover:bg-accent/10 rounded"
								>
									{item.label}
								</button>
							);
						}

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setOpen(false)}
								className="font-mono text-base hover:text-accent transition-colors py-3 px-4 hover:bg-accent/10 rounded"
							>
								{item.label}
							</Link>
						);
					})}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
