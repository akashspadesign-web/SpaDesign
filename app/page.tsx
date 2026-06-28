import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import StatsStrip from "@/components/sections/StatsStrip";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Press from "@/components/sections/Press";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <StatsStrip />
      <ProjectsShowcase />
      <FeaturedProjects />
      <Process />
      <Testimonials />
      <Press />
      <ContactCTA />
    </>
  );
}
