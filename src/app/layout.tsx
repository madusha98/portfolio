import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import siteConfig from "@/data/site-config.json";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: siteConfig.site.title,
	description: siteConfig.site.description,
	keywords: [
		"Madusha Lakruwan",
		"Madusha",
		"Software Engineer Sri Lanka",
		"Software Engineer Colombo",
		"Staff Engineer Sri Lanka",
		"React Native Developer Sri Lanka",
		"Full Stack Developer Colombo",
		"Tech Lead Sri Lanka",
		"Mobile App Developer",
		"Cloud Architecture",
		"AWS Expert Sri Lanka",
		"Azure Developer",
	],
	authors: [{ name: "Madusha Lakruwan" }],
	creator: "Madusha Lakruwan",
	metadataBase: new URL(siteConfig.site.url),
	openGraph: {
		title: siteConfig.site.title,
		description: siteConfig.site.description,
		url: siteConfig.site.url,
		siteName: siteConfig.site.name,
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.site.title,
		description: siteConfig.site.description,
		creator: "@madxsha",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Madusha Lakruwan",
		jobTitle: "Staff Engineer",
		description:
			"Staff Engineer with 7+ years of experience building scalable systems and leading high-performing teams in Sri Lanka",
		url: siteConfig.site.url,
		image: `${siteConfig.site.url}/og-image.jpg`,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Colombo",
			addressRegion: "Western Province",
			addressCountry: "LK",
		},
		alumniOf: {
			"@type": "Organization",
			name: "University of Westminster",
		},
		sameAs: [
			"https://www.linkedin.com/in/madusha-lakruwan/",
			"https://github.com/madusha98",
		],
		knowsAbout: [
			"Software Engineering",
			"React Native",
			"NestJS",
			"Cloud Architecture",
			"AWS",
			"Azure",
			"Mobile Development",
			"Full Stack Development",
			"System Design",
			"Technical Leadership",
		],
		worksFor: {
			"@type": "Organization",
			name: "Surge Global",
		},
	};

	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
