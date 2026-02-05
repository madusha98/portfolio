"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { GlitchText } from "@/components/effects";
import { BlogPost } from "@/types/blog";
import { ReactNode } from "react";

export function BlogPostLayout({
	post,
	children,
}: {
	post: BlogPost;
	children: ReactNode;
}) {
	return (
		<section className="py-20 px-4 min-h-screen">
			<div className="container mx-auto max-w-3xl">
				{/* Back navigation */}
				<ScrollReveal>
					<Link href="/blog">
						<Button
							variant="ghost"
							className="mb-8 font-mono hover:text-accent transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Blog
						</Button>
					</Link>
				</ScrollReveal>

				{/* Header */}
				<ScrollReveal>
					<div className="mb-12">
						<div className="flex flex-wrap items-center gap-3 mb-4">
							<span className="flex items-center gap-1 text-sm text-muted font-mono">
								<Calendar className="h-4 w-4" />
								{new Date(post.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
							<span className="flex items-center gap-1 text-sm text-muted font-mono">
								<Clock className="h-4 w-4" />
								{post.readingTime} min read
							</span>
						</div>
						<h1 className="font-mono text-3xl md:text-5xl font-bold mb-4">
							<span className="text-accent">&gt;</span>{" "}
							<GlitchText glitchOnHover={true} randomGlitch={false}>
								{post.title}
							</GlitchText>
						</h1>
						<div className="flex flex-wrap gap-2 mb-4">
							{post.tags.map((tag) => (
								<Badge key={tag} variant="outline" className="font-mono text-xs">
									{tag}
								</Badge>
							))}
						</div>
						<div className="h-1 w-20 bg-accent mt-4" />
					</div>
				</ScrollReveal>

				{/* MDX Content */}
				<ScrollReveal>
					<article className="mdx-content">{children}</article>
				</ScrollReveal>

				{/* Footer navigation */}
				<ScrollReveal>
					<div className="mt-16 pt-8 border-t border-border">
						<Link href="/blog">
							<Button
								variant="ghost"
								className="font-mono hover:text-accent transition-colors"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								All Posts
							</Button>
						</Link>
					</div>
				</ScrollReveal>
			</div>
		</section>
	);
}
