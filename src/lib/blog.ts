import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { BlogPost } from "@/types/blog";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): BlogPost[] {
	if (!fs.existsSync(BLOG_DIR)) return [];

	const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

	const posts = files
		.map((filename) => {
			const slug = filename.replace(/\.mdx$/, "");
			const filePath = path.join(BLOG_DIR, filename);
			const fileContent = fs.readFileSync(filePath, "utf-8");
			const { data, content } = matter(fileContent);

			return {
				slug,
				title: data.title ?? slug,
				date: data.date ?? "",
				excerpt: data.excerpt ?? "",
				content,
				tags: data.tags ?? [],
				readingTime: Math.ceil(readingTime(content).minutes),
				published: data.published ?? false,
			} satisfies BlogPost;
		})
		.filter((post) => post.published)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	if (!fs.existsSync(filePath)) return undefined;

	const fileContent = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(fileContent);

	return {
		slug,
		title: data.title ?? slug,
		date: data.date ?? "",
		excerpt: data.excerpt ?? "",
		content,
		tags: data.tags ?? [],
		readingTime: Math.ceil(readingTime(content).minutes),
		published: data.published ?? false,
	};
}

export function getAllSlugs(): string[] {
	return getAllPosts().map((post) => post.slug);
}
