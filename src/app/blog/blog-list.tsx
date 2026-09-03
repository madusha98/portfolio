"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { StaggerContainer } from "@/components/animations/stagger-container";
import { BackLink } from "@/components/shared/back-link";
import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import { BlogPost } from "@/types/blog";

export function BlogList({ posts }: { posts: BlogPost[] }) {
	return (
		<section className="min-h-screen px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<BackLink href="/">Home</BackLink>
				</ScrollReveal>

				<ScrollReveal>
					<SectionHeader
						title="Blog"
						subtitle="Thoughts on code, projects, and lessons learned."
						className="mt-8"
					/>
				</ScrollReveal>

				{posts.length === 0 ? (
					<p className="font-mono text-sm text-muted-foreground">
						No posts yet. Check back soon.
					</p>
				) : (
					<StaggerContainer className="border-t border-border">
						{posts.map((post) => (
							<motion.article key={post.slug} variants={staggerItem}>
								<Link
									href={`/blog/${post.slug}`}
									className="group grid gap-3 border-b border-border py-8 md:grid-cols-[10rem_1fr] md:gap-10"
								>
									<div className="flex items-center gap-4 font-mono text-sm text-muted-foreground md:flex-col md:items-start md:gap-2">
										<time dateTime={post.date}>
											{new Date(post.date).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</time>
										<span className="flex items-center gap-1.5 text-xs">
											<Clock className="h-3 w-3" aria-hidden />
											{post.readingTime} min
										</span>
									</div>

									<div>
										<h2 className="flex items-start gap-2 font-mono text-lg font-bold tracking-tight transition-colors group-hover:text-accent">
											{post.title}
											<ArrowUpRight
												className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
												aria-hidden
											/>
										</h2>
										<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
											{post.excerpt}
										</p>
										<ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
											{post.tags.map((tag) => (
												<li
													key={tag}
													className="font-mono text-[11px] text-muted-foreground"
												>
													#{tag}
												</li>
											))}
										</ul>
									</div>
								</Link>
							</motion.article>
						))}
					</StaggerContainer>
				)}
			</div>
		</section>
	);
}
