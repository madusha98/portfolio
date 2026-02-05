import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogList } from "./blog-list";

export const metadata: Metadata = {
	title: "Blog | Madusha Lakruwan",
	description:
		"Thoughts on web development, side projects, and lessons learned.",
};

export default function BlogPage() {
	const posts = getAllPosts();
	return <BlogList posts={posts} />;
}
