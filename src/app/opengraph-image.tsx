import { ImageResponse } from "next/og";
import siteConfig from "@/data/site-config.json";

// Image metadata
export const alt = "Madusha Lakruwan - Staff Engineer & Hobbyist Photographer";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#0a0a0a",
					backgroundImage:
						"radial-gradient(circle at 25px 25px, #111111 2%, transparent 0%), radial-gradient(circle at 75px 75px, #111111 2%, transparent 0%)",
					backgroundSize: "100px 100px",
					position: "relative",
				}}
			>
				{/* Neon green accent overlay */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: "linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, transparent 50%)",
					}}
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: "60px",
						padding: "0 80px",
					}}
				>
					<div
						style={{
							display: "flex",
							width: "280px",
							height: "280px",
							border: "3px solid #39ff14",
							boxShadow: "6px 6px 0 0 #39ff14",
							overflow: "hidden",
							backgroundColor: "#111111",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<img
							src={`${siteConfig.site.url}/me.jpg`}
							alt="Madusha Lakruwan"
							width={280}
							height={280}
							style={{
								objectFit: "cover",
							}}
						/>
					</div>

					{/* Text Content */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							maxWidth: "700px",
						}}
					>
						{/* Name */}
						<div
							style={{
								fontSize: "72px",
								fontWeight: "bold",
								color: "#ededed",
								lineHeight: 1.1,
								marginBottom: "16px",
								fontFamily: "monospace",
							}}
						>
							{siteConfig.site.name}
						</div>

						{/* Title */}
						<div
							style={{
								fontSize: "36px",
								color: "#39ff14",
								marginBottom: "24px",
								fontFamily: "monospace",
							}}
						>
							Staff Engineer
						</div>

						{/* Location & Tech Stack */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "12px",
							}}
						>
							<div
								style={{
									fontSize: "24px",
									color: "#9ca3af",
									fontFamily: "monospace",
								}}
							>
								📍 Colombo, Sri Lanka
							</div>
							<div
								style={{
									fontSize: "24px",
									color: "#9ca3af",
									fontFamily: "monospace",
								}}
							>
								💼 React Native • NestJS • AWS • Azure
							</div>
							<div
								style={{
									fontSize: "24px",
									color: "#9ca3af",
									fontFamily: "monospace",
								}}
							>
								📸 Hobbyist Photographer
							</div>
						</div>
					</div>
				</div>

				{/* Footer URL */}
				<div
					style={{
						position: "absolute",
						bottom: "40px",
						fontSize: "24px",
						color: "#6b7280",
						fontFamily: "monospace",
					}}
				>
					madushalakruwan.com
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
