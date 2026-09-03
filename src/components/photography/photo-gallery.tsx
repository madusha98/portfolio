"use client";

import { useState, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { BackLink } from "@/components/shared/back-link";
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

	const allImages = groups.flatMap((g) => g.images);

	const handleOpen = useCallback(
		(image: GalleryImage) => {
			const flatIndex = allImages.findIndex((i) => i.publicId === image.publicId);
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
		<section className="min-h-screen px-6 py-24 md:px-10 md:py-32">
			<div className="mx-auto max-w-5xl">
				<ScrollReveal>
					<BackLink href="/">Home</BackLink>
				</ScrollReveal>

				<ScrollReveal>
					<SectionHeader
						title="Photography"
						subtitle="Moments captured through my lens."
						className="mt-8"
					/>
				</ScrollReveal>

				{groups.length === 0 && (
					<p className="font-mono text-sm text-muted-foreground">
						<span className="text-accent">&gt;</span> No photos found. Upload images to
						the <span className="text-accent">photography/</span> folder in Cloudinary.
					</p>
				)}

				{groups.map((group, groupIndex) => (
					<div key={group.label} className="mb-16">
						<ScrollReveal delay={groupIndex * 0.05}>
							<div className="mb-6 flex items-center gap-4">
								<h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
									{group.label}
								</h2>
								<span className="rule" />
							</div>
						</ScrollReveal>

						<div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3">
							{group.images.map((image, imageIndex) => (
								<ScrollReveal
									key={image.publicId}
									delay={groupIndex * 0.05 + imageIndex * 0.04}
								>
									<button
										onClick={() => handleOpen(image)}
										className="group relative aspect-square w-full cursor-pointer overflow-hidden bg-background"
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
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											sizes="(max-width: 768px) 50vw, 33vw"
										/>

										<div className="absolute inset-0 flex items-end bg-background/85 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
											<div className="text-left font-mono text-xs">
												{image.caption && (
													<p className="mb-1 line-clamp-2 text-foreground">
														{image.caption}
													</p>
												)}
												{image.camera && (
													<p className="text-accent">{image.camera}</p>
												)}
											</div>
										</div>
									</button>
								</ScrollReveal>
							))}
						</div>
					</div>
				))}
			</div>

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
