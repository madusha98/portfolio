"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import cvData from "@/data/cv.json";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
	const { scrollToSection } = useSmoothScroll();

	return (
		<section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
			<motion.div
				variants={staggerContainer}
				initial="hidden"
				animate="visible"
				className="max-w-4xl mx-auto text-center"
			>
				<motion.div variants={staggerItem} className="mb-4">
					<span className="font-mono text-accent">Hello, I&apos;m</span>
				</motion.div>

				<motion.h1
					variants={staggerItem}
					className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
				>
					{cvData.personal.name}
				</motion.h1>

				<motion.h2 variants={staggerItem} className="text-2xl md:text-3xl text-muted mb-6">
					{cvData.personal.title}
				</motion.h2>

				<motion.p variants={staggerItem} className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
					{cvData.personal.tagline}
				</motion.p>

				<motion.div variants={staggerItem} className="flex gap-4 justify-center flex-wrap">
					<Button
						onClick={() => scrollToSection("contact")}
						className="pixel-border-accent font-mono"
						size="lg"
					>
						Get In Touch
					</Button>
					<Button
						onClick={() => scrollToSection("experience")}
						variant="outline"
						className="pixel-border font-mono"
						size="lg"
					>
						View Work
					</Button>
				</motion.div>

				<motion.div
					variants={staggerItem}
					className="mt-16 animate-bounce cursor-pointer"
					onClick={() => scrollToSection("about")}
				>
					<ArrowDown className="mx-auto h-6 w-6 text-accent" />
				</motion.div>
			</motion.div>
		</section>
	);
}
