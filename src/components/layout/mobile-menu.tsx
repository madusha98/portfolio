"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/data/site-config.json";

const itemClass =
	"border-b border-border py-4 text-left font-mono text-sm transition-colors hover:text-accent";

export function MobileMenu() {
	const [open, setOpen] = useState(false);
	const { scrollToSection } = useSmoothScroll();
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	const handleNavClick = (href: string) => {
		setOpen(false);
		const sectionId = href.replace("/#", "");
		if (isHomePage) {
			setTimeout(() => scrollToSection(sectionId), 100);
		} else {
			window.location.href = href;
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-none">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-72 border-border bg-background p-0 sm:w-80">
				<SheetHeader className="border-b border-border px-6 py-4">
					<SheetTitle className="text-left font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
						Menu
					</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col px-6">
					{siteConfig.navigation.map((item) =>
						item.href.startsWith("/#") ? (
							<button
								key={item.href}
								onClick={() => handleNavClick(item.href)}
								className={itemClass}
							>
								{item.label}
							</button>
						) : (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setOpen(false)}
								className={itemClass}
							>
								{item.label}
							</Link>
						)
					)}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
