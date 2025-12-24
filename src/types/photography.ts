export interface PhotoImage {
	url: string;
	alt: string;
	caption: string;
	camera?: string;
	settings?: string;
}

export interface PhotoCollection {
	id: string;
	slug: string;
	title: string;
	location: string;
	date: string;
	coverImage: string;
	story: string;
	images: PhotoImage[];
	tags: string[];
}
