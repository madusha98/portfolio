import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
	h1: (props) => (
		<h1
			className="font-mono text-3xl font-bold mt-10 mb-4 text-foreground"
			{...props}
		/>
	),
	h2: (props) => (
		<h2
			className="font-mono text-2xl font-bold mt-8 mb-3 text-foreground"
			{...props}
		/>
	),
	h3: (props) => (
		<h3
			className="font-mono text-xl font-bold mt-6 mb-2 text-foreground"
			{...props}
		/>
	),
	p: (props) => (
		<p className="text-muted-foreground leading-relaxed mb-4" {...props} />
	),
	a: (props) => (
		<a
			className="text-accent underline underline-offset-4 hover:text-accent/80 transition-colors"
			target="_blank"
			rel="noopener noreferrer"
			{...props}
		/>
	),
	ul: (props) => (
		<ul
			className="list-disc list-inside mb-4 space-y-1 text-muted-foreground"
			{...props}
		/>
	),
	ol: (props) => (
		<ol
			className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground"
			{...props}
		/>
	),
	li: (props) => <li className="text-muted-foreground" {...props} />,
	blockquote: (props) => (
		<blockquote
			className="border-l-4 border-accent pl-4 my-4 italic text-muted-foreground"
			{...props}
		/>
	),
	code: (props) => {
		const isInline = typeof props.children === "string";
		if (isInline) {
			return (
				<code
					className="bg-card border border-border px-1.5 py-0.5 rounded font-mono text-sm text-accent"
					{...props}
				/>
			);
		}
		return <code {...props} />;
	},
	pre: (props) => (
		<pre
			className="bg-card border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm pixel-border"
			{...props}
		/>
	),
	hr: () => <hr className="border-border my-8" />,
	table: (props) => (
		<div className="overflow-x-auto mb-4">
			<table
				className="w-full border-collapse border border-border font-mono text-sm"
				{...props}
			/>
		</div>
	),
	th: (props) => (
		<th
			className="border border-border bg-card px-3 py-2 text-left text-accent font-bold"
			{...props}
		/>
	),
	td: (props) => (
		<td
			className="border border-border px-3 py-2 text-muted-foreground"
			{...props}
		/>
	),
	strong: (props) => (
		<strong className="font-bold text-foreground" {...props} />
	),
};
