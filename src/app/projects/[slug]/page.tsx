import { Metadata } from "next";
import { notFound } from "next/navigation";
import projectsData from "@/data/projects.json";
import { ProjectDetail } from "./project-detail";

interface ProjectPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return projectsData.map((project) => ({
		slug: project.slug,
	}));
}

export async function generateMetadata({
	params,
}: ProjectPageProps): Promise<Metadata> {
	const { slug } = await params;
	const project = projectsData.find((p) => p.slug === slug);

	if (!project) {
		return { title: "Project Not Found" };
	}

	return {
		title: `${project.title} | Madusha Lakruwan`,
		description: project.tagline,
		openGraph: {
			title: project.title,
			description: project.tagline,
		},
	};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;
	const project = projectsData.find((p) => p.slug === slug);

	if (!project) {
		notFound();
	}

	return <ProjectDetail project={project} />;
}
