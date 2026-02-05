import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/blog/mdx-components";
import { BlogPostLayout } from "./blog-post";

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return { title: "Post Not Found" };
	}

	return {
		title: `${post.title} | Madusha Lakruwan`,
		description: post.excerpt,
		openGraph: {
			title: post.title,
			description: post.excerpt,
			type: "article",
			publishedTime: post.date,
			tags: post.tags,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post || !post.published) {
		notFound();
	}

	const mdxContent = (
		<MDXRemote
			source={post.content}
			components={mdxComponents}
			options={{
				mdxOptions: {
					remarkPlugins: [remarkGfm],
				},
			}}
		/>
	);

	return (
		<BlogPostLayout post={post}>
			{mdxContent}
		</BlogPostLayout>
	);
}
