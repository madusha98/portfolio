import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
	return (
		<>
			<HeroSection />
			<div className="relative z-10">
				<div style={{ background: 'linear-gradient(to bottom, transparent, var(--background) 50%)' }}>
					<AboutSection />
				</div>
				<div className="bg-background">
					<ExperienceSection />
					<SkillsSection />
					<FeaturedProjectsSection />
					<ContactSection />
				</div>
			</div>
		</>
	);
}
