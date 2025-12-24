export interface Project {
	id: string;
	slug: string;
	title: string;
	tagline: string;
	description: string;
	featured: boolean;
	image: string;
	images: string[];
	technologies: string[];
	links: {
		github?: string;
		demo?: string;
		case_study?: string;
	};
	year: string;
	category: string;
	challenge?: string;
	solution?: string;
	impact?: string;
}
