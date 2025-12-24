export interface PersonalInfo {
	name: string;
	title: string;
	tagline: string;
	email: string;
	phone: string;
	location: string;
	bio: string;
	socials: {
		github?: string;
		linkedin?: string;
		twitter?: string;
		instagram?: string;
	};
}

export interface Experience {
	id: string;
	company: string;
	position: string;
	location: string;
	startDate: string;
	endDate: string | null;
	current: boolean;
	description: string;
	achievements: string[];
	technologies: string[];
}

export interface Skills {
	architecture: string[];
	frontend: string[];
	backend: string[];
	devops: string[];
	ai: string[];
}

export interface Education {
	id: string;
	institution: string;
	degree: string;
	startDate: string;
	endDate: string;
	distinction?: boolean;
}

export interface CVData {
	personal: PersonalInfo;
	experience: Experience[];
	skills: Skills;
	education: Education[];
	certificates: string[];
	languages: string[];
}
