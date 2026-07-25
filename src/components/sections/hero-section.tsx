"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { calculateYearsDiff } from "@/lib/utils";
import cvData from "@/data/cv.json";
import { ArrowDown } from "lucide-react";
import { VHS } from "@/components/canvasui/VHS";
import { Effect } from "@/components/canvasui/effect";

export function HeroSection() {
	const { scrollToSection } = useSmoothScroll();
	const years = calculateYearsDiff("2018-10");

	return (
		<section
			id="home"
			className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20 md:px-10"
		>
			<div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />

			<Effect effect={VHS} className="relative z-10 mx-auto w-full max-w-5xl">
				<motion.div variants={staggerContainer} initial="hidden" animate="visible">
					<motion.p
						variants={staggerItem}
						className="prompt caret font-mono text-sm text-foreground"
					>
						whoami
					</motion.p>

					<motion.h1
						variants={staggerItem}
						className="mt-8 font-mono text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
					>
						{cvData.personal.name}
					</motion.h1>

					<motion.p
						variants={staggerItem}
						className="mt-4 font-mono text-lg text-accent sm:text-xl"
					>
						<span className="text-muted-foreground">&gt;</span> {cvData.personal.title}
					</motion.p>

					<motion.p
						variants={staggerItem}
						className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground"
					>
						{cvData.personal.tagline}
					</motion.p>

					<motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-4">
						<Button
							onClick={() => scrollToSection("contact")}
							size="lg"
							className="key key-accent rounded-none font-mono"
						>
							Get in touch
						</Button>
						<Button
							onClick={() => scrollToSection("experience")}
							variant="outline"
							size="lg"
							className="key rounded-none font-mono"
						>
							View work
						</Button>
					</motion.div>

					<motion.dl
						variants={staggerItem}
						className="mt-16 grid max-w-lg grid-cols-3 gap-px border border-border bg-border"
					>
						{[
							{ value: `${years}+`, label: "Years" },
							{ value: "15+", label: "Projects" },
							{ value: "10+", label: "Team led" },
						].map((stat) => (
							<div key={stat.label} className="bg-background px-4 py-5">
								<dt className="font-mono text-2xl font-bold text-accent">{stat.value}</dt>
								<dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
									{stat.label}
								</dd>
							</div>
						))}
					</motion.dl>
				</motion.div>
			</Effect>

			<button
				onClick={() => scrollToSection("about")}
				aria-label="Scroll to about section"
				className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-accent"
			>
				<ArrowDown className="h-5 w-5 animate-bounce" />
			</button>
		</section>
	);
}
