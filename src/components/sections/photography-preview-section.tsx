"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import Link from "next/link";
import photographyData from "@/data/photography.json";

export function PhotographyPreviewSection() {
	// Show only first 4 collections
	const previewCollections = photographyData.slice(0, 4);

	return (
		<section className="py-20 px-4">
			<div className="container mx-auto max-w-6xl">
				<ScrollReveal>
					<SectionHeader title="Photography" subtitle="Moments captured through my lens" />
				</ScrollReveal>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
					{previewCollections.map((collection, index) => (
						<ScrollReveal key={collection.id} delay={index * 0.1}>
							<Link
								href={`/photography/${collection.slug}`}
								className="group relative aspect-square overflow-hidden pixel-border bg-muted"
							>
								{/* Placeholder for image - will be replaced when real images are added */}
								<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 to-secondary/20">
									<Camera className="h-12 w-12 text-muted opacity-50" />
								</div>

								{/* Overlay */}
								<div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
									<div className="text-center">
										<h3 className="font-mono font-bold mb-1 text-sm">{collection.title}</h3>
										<p className="text-xs text-muted">{collection.location}</p>
									</div>
								</div>
							</Link>
						</ScrollReveal>
					))}
				</div>

				<ScrollReveal className="text-center">
					<Link href="/photography">
						<Button variant="outline" className="pixel-border font-mono" size="lg">
							View Full Gallery
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</ScrollReveal>
			</div>
		</section>
	);
}
