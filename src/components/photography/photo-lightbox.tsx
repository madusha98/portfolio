"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CldImage } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/cloudinary";

interface PhotoLightboxProps {
	image: GalleryImage;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
	currentIndex: number;
	totalCount: number;
}

export function PhotoLightbox({
	image,
	onClose,
	onPrev,
	onNext,
	currentIndex,
	totalCount,
}: PhotoLightboxProps) {
	const touchStartX = useRef<number | null>(null);
	const [direction, setDirection] = useState(0);
	const [loaded, setLoaded] = useState(false);

	// Reset loaded state when image changes
	useEffect(() => {
		setLoaded(false);
	}, [image.publicId]);

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") {
				setDirection(-1);
				onPrev();
			}
			if (e.key === "ArrowRight") {
				setDirection(1);
				onNext();
			}
		},
		[onClose, onPrev, onNext]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [handleKeyDown]);

	// Touch swipe
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const diff = e.changedTouches[0].clientX - touchStartX.current;
		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				setDirection(-1);
				onPrev();
			} else {
				setDirection(1);
				onNext();
			}
		}
		touchStartX.current = null;
	};

	const formattedDate = new Date(image.dateTaken).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return createPortal(
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-[60] flex items-center justify-center"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/95 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Counter */}
			<div className="absolute top-4 left-4 z-20 font-mono text-xs text-white/60">
				{currentIndex + 1}/{totalCount}
			</div>

			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute top-3 right-3 z-30 p-3 text-white hover:text-accent transition-colors"
			>
				<X className="h-7 w-7" />
			</button>

			{/* Navigation arrows */}
			<button
				onClick={(e) => {
					e.stopPropagation();
					setDirection(-1);
					onPrev();
				}}
				className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 border border-white/20 text-white/70 hover:text-accent transition-colors bg-black/50"
			>
				<ChevronLeft className="h-6 w-6" />
			</button>

			<button
				onClick={(e) => {
					e.stopPropagation();
					setDirection(1);
					onNext();
				}}
				className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 border border-white/20 text-white/70 hover:text-accent transition-colors bg-black/50"
			>
				<ChevronRight className="h-6 w-6" />
			</button>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center w-full h-full px-12 md:px-16 py-14">
				{/* Image */}
				<AnimatePresence mode="wait" custom={direction}>
					<motion.div
						key={image.publicId}
						custom={direction}
						initial={{ opacity: 0, x: direction * 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: direction * -100 }}
						transition={{ duration: 0.2 }}
						className="relative flex-1 min-h-0 w-full flex items-center justify-center"
					>
						{/* Low-res blurred placeholder */}
						<CldImage
							src={image.publicId}
							width={48}
							height={32}
							crop="fit"
							quality={30}
							format="auto"
							alt=""
							className={`max-h-full max-w-full object-contain transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
							style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
							aria-hidden="true"
						/>
						{/* Full-res image */}
						<CldImage
							src={image.publicId}
							width={1920}
							height={1280}
							crop="fit"
							quality="auto"
							format="auto"
							alt={image.caption || "Photography"}
							className={`absolute inset-0 max-h-full max-w-full object-contain m-auto transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
							sizes="95vw"
							onLoad={() => setLoaded(true)}
						/>
					</motion.div>
				</AnimatePresence>

				{/* Metadata panel — terminal style */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mt-3 w-full max-w-xl font-mono text-xs space-y-0.5 px-4 shrink-0"
				>
					<div className="flex flex-wrap gap-x-4 gap-y-0.5 text-white/60">
						{image.camera && (
							<p>
								<span className="text-accent">{">"}</span> {image.camera}
							</p>
						)}
						{image.settings && (
							<p>
								<span className="text-accent">{">"}</span> {image.settings}
							</p>
						)}
						<p>
							<span className="text-accent">{">"}</span> {formattedDate}
						</p>
					</div>
					{image.caption && (
						<p className="text-foreground">
							<span className="text-accent">{">"}</span> {image.caption}_
						</p>
					)}
				</motion.div>
			</div>
		</motion.div>,
		document.body
	);
}
