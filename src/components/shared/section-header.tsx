import { cn } from "@/lib/utils";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
	return (
		<div className={cn("mb-12", className)}>
			<h2 className="font-mono text-3xl md:text-4xl font-bold mb-2">
				<span className="text-accent">&gt;</span> {title}
			</h2>
			{subtitle && <p className="text-muted text-lg">{subtitle}</p>}
			<div className="h-1 w-20 bg-accent mt-4" />
		</div>
	);
}
