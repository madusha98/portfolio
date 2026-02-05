import { Metadata } from "next";
import { ProjectsGrid } from "./projects-grid";

export const metadata: Metadata = {
	title: "Projects | Madusha Lakruwan",
	description:
		"Explore my portfolio of projects spanning mobile apps, full-stack platforms, and AI-powered solutions.",
};

export default function ProjectsPage() {
	return <ProjectsGrid />;
}
