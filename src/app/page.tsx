import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Effect } from "@/components/canvasui/effect";
import { Clouds } from "@/components/canvasui/Clouds";
import { RetroDither } from "@/components/canvasui/RetroDither";
import { Grid } from "@/components/canvasui/Grid";
import { Shatter } from "@/components/canvasui/Shatter";
import { Ripple } from "@/components/canvasui/Ripple";

/**
 * Each section runs a different Canvas UI effect, mounted only while on screen
 * and only where HTML-in-Canvas exists. Everywhere else the sections render as
 * plain DOM. See /effects for the full set.
 */
export default function Home() {
	return (
		<>
			<HeroSection />
			<Effect effect={Clouds} lazy>
				<AboutSection />
			</Effect>
			<Effect effect={RetroDither} lazy>
				<ExperienceSection />
			</Effect>
			<Effect effect={Grid} lazy>
				<SkillsSection />
			</Effect>
			<Effect effect={Shatter} lazy>
				<FeaturedProjectsSection />
			</Effect>
			<Effect effect={Ripple} lazy>
				<ContactSection />
			</Effect>
		</>
	);
}
