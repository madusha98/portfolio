"use client";

import { useState, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { RGBSplit } from "@/components/effects";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PhotoLightbox } from "./photo-lightbox";
import type { GalleryGroup, GalleryImage } from "@/lib/cloudinary";

interface PhotoGalleryProps {
	groups: GalleryGroup[];
}

export function PhotoGallery({ groups }: PhotoGalleryProps) {
	const [lightboxImage, setLightboxImage] = useState<{
		image: GalleryImage;
		flatIndex: number;
	} | null>(null);

	// Flatten all images for lightbox navigation
	const allImages = groups.flatMap((g) => g.images);

	const handleOpen = useCallback(
		(image: GalleryImage) => {
			const flatIndex = allImages.findIndex(
				(i) => i.publicId === image.publicId
			);
			setLightboxImage({ image, flatIndex });
		},
		[allImages]
	);

	const handleNavigate = useCallback(
		(direction: "prev" | "next") => {
			if (!lightboxImage) return;
			const newIndex =
				direction === "next"
					? (lightboxImage.flatIndex + 1) % allImages.length
					: (lightboxImage.flatIndex - 1 + allImages.length) % allImages.length;
			setLightboxImage({ image: allImages[newIndex], flatIndex: newIndex });
		},
		[lightboxImage, allImages]
	);

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
						title="Photography"
						subtitle="Moments captured through my lens"
					/>
				</ScrollReveal>

				{groups.length === 0 && (
					<ScrollReveal>
						<div className="text-center py-20">
							<p className="font-mono text-muted">
								{">"} No photos found. Upload images to the{" "}
								<span className="text-accent">photography/</span> folder in
								Cloudinary._
							</p>
						</div>
					</ScrollReveal>
				)}

				{/* Timeline */}
				<div className="relative">
					{/* Vertical line — hidden on mobile */}
					<div
						className="hidden md:block absolute left-[120px] top-0 bottom-0 w-0.5 bg-accent/50"
						style={{
							boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)",
						}}
					/>

					{groups.map((group, groupIndex) => (
						<div key={group.label} className="mb-16">
							{/* Month/Year label */}
							<ScrollReveal delay={groupIndex * 0.05}>
								<div className="flex items-center gap-4 mb-6 md:mb-8">
									{/* Timeline node — hidden on mobile */}
									<div className="hidden md:flex w-[120px] justify-end items-center">
										<span className="font-mono text-sm text-accent whitespace-nowrap">
											{">"} {group.label.toUpperCase()}_
										</span>
									</div>
									<div className="hidden md:block relative">
										<div
											className="w-3 h-3 bg-accent pixel-border"
											style={{
												boxShadow: "0 0 8px rgba(57, 255, 20, 0.5)",
											}}
										/>
									</div>
									{/* Mobile label */}
									<div className="md:hidden font-mono text-sm text-accent">
										{">"} {group.label.toUpperCase()}_
									</div>
								</div>
							</ScrollReveal>

							{/* Image grid */}
							<div className="md:ml-[152px]">
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
									{group.images.map((image, imageIndex) => (
										<ScrollReveal
											key={image.publicId}
											delay={groupIndex * 0.05 + imageIndex * 0.05}
										>
											<RGBSplit>
												<button
													onClick={() => handleOpen(image)}
													className="group relative aspect-square overflow-hidden pixel-border bg-card w-full cursor-pointer"
												>
													<CldImage
														src={image.publicId}
														width={400}
														height={400}
														crop="fill"
														gravity="auto"
														quality="auto"
														format="auto"
														alt={image.caption || "Photography"}
														className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
														sizes="(max-width: 768px) 50vw, 33vw"
													/>

													{/* Hover overlay */}
													<div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
														<div className="font-mono text-xs">
															{image.caption && (
																<p className="text-foreground line-clamp-2 mb-1">
																	{image.caption}
																</p>
															)}
															{image.camera && (
																<p className="text-accent">{image.camera}</p>
															)}
														</div>
													</div>

													{/* Scanline hover effect */}
													<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scan-lines" />
												</button>
											</RGBSplit>
										</ScrollReveal>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Lightbox */}
			{lightboxImage && (
				<PhotoLightbox
					image={lightboxImage.image}
					onClose={() => setLightboxImage(null)}
					onPrev={() => handleNavigate("prev")}
					onNext={() => handleNavigate("next")}
					currentIndex={lightboxImage.flatIndex}
					totalCount={allImages.length}
				/>
			)}
		</section>
	);
}
