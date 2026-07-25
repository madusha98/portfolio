"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { BackLink } from "@/components/shared/back-link";
import { Clock, Calendar } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { ReactNode } from "react";

export function BlogPostLayout({ post, children }: { post: BlogPost; children: ReactNode }) {
	return (
		<section className="min-h-screen px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-3xl">
				<ScrollReveal>
					<BackLink href="/blog">Blog</BackLink>
				</ScrollReveal>

				<ScrollReveal>
					<header className="mt-8 mb-12 border-b border-border pb-8">
						<div className="flex flex-wrap items-center gap-5 font-mono text-xs text-muted-foreground">
							<span className="flex items-center gap-1.5">
								<Calendar className="h-3.5 w-3.5" aria-hidden />
								<time dateTime={post.date}>
									{new Date(post.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</time>
							</span>
							<span className="flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5" aria-hidden />
								{post.readingTime} min read
							</span>
						</div>

						<h1 className="mt-5 text-balance font-mono text-3xl font-bold tracking-tight md:text-4xl">
							{post.title}
						</h1>

						<ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
							{post.tags.map((tag) => (
								<li key={tag} className="font-mono text-[11px] text-accent">
									#{tag}
								</li>
							))}
						</ul>
					</header>
				</ScrollReveal>

				<ScrollReveal>
					<article className="mdx-content prose prose-neutral max-w-none dark:prose-invert prose-headings:font-mono prose-headings:tracking-tight prose-a:text-accent">
						{children}
					</article>
				</ScrollReveal>

				<div className="mt-16 border-t border-border pt-8">
					<BackLink href="/blog">All posts</BackLink>
				</div>
			</div>
		</section>
	);
}
