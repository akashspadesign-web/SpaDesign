import type { Metadata } from "next";
import InteriorHero from "@/components/sections/InteriorHero";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "Interior Design",
  description:
    "Residential, hospitality and workplace interiors, composed in the same studio that draws the building.",
};

export default function InteriorsPage() {
  return (
    <>
      <InteriorHero />
      <ContactCTA />
    </>
  );
}
