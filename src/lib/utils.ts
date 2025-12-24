import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});
}

export function formatDateRange(startDate: string, endDate: string | null): string {
	const start = formatDate(startDate);
	const end = endDate ? formatDate(endDate) : "Present";
	return `${start} - ${end}`;
}

export function calculateYearsDiff(startDate: string, endDate: string | null = null): number {
	const start = new Date(startDate);
	const end = endDate ? new Date(endDate) : new Date();
	const diffTime = Math.abs(end.getTime() - start.getTime());
	const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
	return Math.floor(diffYears);
}
