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
			<AboutSection />
			<ExperienceSection />
			<SkillsSection />
			<FeaturedProjectsSection />
			<ContactSection />
		</>
	);
}
