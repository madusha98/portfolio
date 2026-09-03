import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link
			href={href}
			className="group inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-accent"
		>
			<ArrowLeft
				className="h-4 w-4 transition-transform group-hover:-translate-x-1"
				aria-hidden
			/>
			{children}
		</Link>
	);
}
