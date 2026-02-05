import { Metadata } from "next";
import { fetchAllPhotos } from "@/lib/cloudinary";
import { PhotoGallery } from "@/components/photography/photo-gallery";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Photography | Madusha Lakruwan",
	description:
		"Moments captured through my lens — a timeline of photographs.",
};

export default async function PhotographyPage() {
	const groups = await fetchAllPhotos();

	return <PhotoGallery groups={groups} />;
}
