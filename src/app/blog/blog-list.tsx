"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RGBSplit, GlitchText } from "@/components/effects";
import { BlogPost } from "@/types/blog";

export function BlogList({ posts }: { posts: BlogPost[] }) {
	return (
		<section className="py-20 px-4 min-h-screen">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<Link href="/">
						<Button
							variant="ghost"
							className="mb-8 font-mono hover:text-accent transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</Link>
				</ScrollReveal>

				<ScrollReveal>
					<SectionHeader
						title="Blog"
						subtitle="Thoughts on code, projects, and lessons learned"
					/>
				</ScrollReveal>

				{posts.length === 0 ? (
					<ScrollReveal>
						<p className="text-muted-foreground font-mono">
							No posts yet. Check back soon.
						</p>
					</ScrollReveal>
				) : (
					<div className="grid md:grid-cols-2 gap-6 max-w-4xl">
						{posts.map((post, index) => (
							<ScrollReveal key={post.slug} delay={index * 0.1}>
								<RGBSplit className="block w-full">
									<motion.div whileHover="hover" initial="rest">
										<Link href={`/blog/${post.slug}`}>
											<Card className="pixel-border h-full flex flex-col cursor-pointer">
												<CardHeader>
													<div className="flex items-center justify-between mb-2">
														<Badge variant="outline" className="font-mono">
															{new Date(post.date).toLocaleDateString(
																"en-US",
																{
																	year: "numeric",
																	month: "short",
																	day: "numeric",
																}
															)}
														</Badge>
														<span className="flex items-center gap-1 text-xs text-muted font-mono">
															<Clock className="h-3 w-3" />
															{post.readingTime} min
														</span>
													</div>
													<CardTitle className="font-mono">
														<GlitchText
															glitchOnHover={true}
															randomGlitch={false}
														>
															{post.title}
														</GlitchText>
													</CardTitle>
													<CardDescription>{post.excerpt}</CardDescription>
												</CardHeader>
												<CardContent className="flex-1 flex flex-col">
													<div className="flex flex-wrap gap-2 mb-4">
														{post.tags.map((tag) => (
															<Badge
																key={tag}
																variant="outline"
																className="text-xs"
															>
																{tag}
															</Badge>
														))}
													</div>

													<div className="mt-auto flex items-center text-sm font-mono text-accent group">
														Read more
														<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
													</div>
												</CardContent>
											</Card>
										</Link>
									</motion.div>
								</RGBSplit>
							</ScrollReveal>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
