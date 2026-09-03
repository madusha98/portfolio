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
			className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
		>
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 md:px-10">
				<Link
					href="/"
					className="font-mono text-sm font-bold tracking-tight transition-colors hover:text-accent"
				>
					ML<span className="text-accent">.</span>
				</Link>

				<div className="hidden md:block">
					<Navigation />
				</div>
				<div className="md:hidden">
					<MobileMenu />
				</div>
			</div>
		</motion.header>
	);
}
