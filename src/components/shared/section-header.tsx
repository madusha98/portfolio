import { cn } from "@/lib/utils";

interface SectionHeaderProps {
	/** Two-digit section index, e.g. "01". Omit on standalone pages. */
	index?: string;
	title: string;
	subtitle?: string;
	className?: string;
}

export function SectionHeader({ index, title, subtitle, className }: SectionHeaderProps) {
	return (
		<div className={cn("mb-12 md:mb-16", className)}>
			<div className="flex items-center gap-4">
				{index && (
					<span className="font-mono text-xs tracking-[0.2em] text-accent">{index}</span>
				)}
				<h2 className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
					{title}
				</h2>
				<span className="rule" />
			</div>
			{subtitle && (
				<p className="mt-4 max-w-2xl text-balance text-2xl md:text-3xl font-medium tracking-tight">
					{subtitle}
				</p>
			)}
		</div>
	);
}
