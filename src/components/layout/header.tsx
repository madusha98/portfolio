"use client";

import { Navigation } from "./navigation";
import { MobileMenu } from "./mobile-menu";
import { motion } from "framer-motion";
import { fadeInDown } from "@/lib/animations";
import Link from "next/link";

export function Header() {
	return (
		<motion.header
			initial="hidden"
			animate="visible"
			variants={fadeInDown}
			className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-2 border-foreground"
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link href="/" className="font-mono text-xl font-bold hover:text-accent transition-colors">
						ML.
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<Navigation />
					</div>

					{/* Mobile Menu */}
					<div className="md:hidden">
						<MobileMenu />
					</div>
				</div>
			</div>
		</motion.header>
	);
}
