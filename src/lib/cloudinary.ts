import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface GalleryImage {
	publicId: string;
	width: number;
	height: number;
	caption?: string;
	camera?: string;
	settings?: string;
	dateTaken: string;
	format: string;
}

export interface GalleryGroup {
	label: string;
	date: Date;
	images: GalleryImage[];
}

function formatMonthYear(date: Date): string {
	return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function parseExifDate(exifDate?: string): Date | null {
	if (!exifDate) return null;
	// EXIF dates are formatted as "YYYY:MM:DD HH:MM:SS"
	const normalized = exifDate.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
	const parsed = new Date(normalized);
	return isNaN(parsed.getTime()) ? null : parsed;
}

function extractExifSettings(imageInfo: Record<string, unknown>): {
	camera?: string;
	settings?: string;
} {
	const make = imageInfo?.Make as string | undefined;
	const model = imageInfo?.Model as string | undefined;
	const fNumber = imageInfo?.FNumber as number | undefined;
	const exposureTime = imageInfo?.ExposureTime as number | undefined;
	const iso = imageInfo?.ISO as number | undefined;

	const camera = model
		? make && !model.startsWith(make)
			? `${make} ${model}`
			: model
		: undefined;

	const parts: string[] = [];
	if (fNumber) parts.push(`f/${fNumber}`);
	if (exposureTime) {
		parts.push(
			exposureTime < 1
				? `1/${Math.round(1 / exposureTime)}s`
				: `${exposureTime}s`
		);
	}
	if (iso) parts.push(`ISO ${iso}`);

	return {
		camera,
		settings: parts.length > 0 ? parts.join(", ") : undefined,
	};
}

export async function fetchAllPhotos(): Promise<GalleryGroup[]> {
	let allResources: Record<string, unknown>[] = [];
	let nextCursor: string | undefined;

	// Paginate through all results
	do {
		const result = await cloudinary.search
			.expression("folder:photography AND resource_type:image")
			.with_field("context")
			.with_field("image_metadata")
			.sort_by("created_at", "desc")
			.max_results(100)
			.next_cursor(nextCursor || "")
			.execute();

		allResources = allResources.concat(result.resources);
		nextCursor = result.next_cursor;
	} while (nextCursor);

	// Map to GalleryImage
	const images: GalleryImage[] = allResources.map(
		(resource: Record<string, unknown>) => {
			const imageMetadata =
				(resource.image_metadata as Record<string, unknown>) || {};
			const context =
				(resource.context as Record<string, Record<string, string>>) || {};
			const customContext = context.custom || {};
			const exifDateStr = imageMetadata.DateTimeOriginal as string | undefined;
			const exifDate = parseExifDate(exifDateStr);
			const uploadDate = new Date(resource.created_at as string);
			const { camera, settings } = extractExifSettings(imageMetadata);

			return {
				publicId: resource.public_id as string,
				width: resource.width as number,
				height: resource.height as number,
				caption: customContext.caption || customContext.alt || undefined,
				camera,
				settings,
				dateTaken: (exifDate || uploadDate).toISOString(),
				format: resource.format as string,
			};
		}
	);

	// Group by month/year
	const groups = new Map<string, GalleryImage[]>();

	for (const image of images) {
		const date = new Date(image.dateTaken);
		const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
		if (!groups.has(key)) {
			groups.set(key, []);
		}
		groups.get(key)!.push(image);
	}

	// Convert to array, sorted newest first
	const result: GalleryGroup[] = Array.from(groups.entries())
		.sort(([a], [b]) => b.localeCompare(a))
		.map(([key, imgs]) => {
			const [year, month] = key.split("-").map(Number);
			const date = new Date(year, month, 1);
			return {
				label: formatMonthYear(date),
				date,
				images: imgs.sort(
					(a, b) =>
						new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime()
				),
			};
		});

	return result;
}
