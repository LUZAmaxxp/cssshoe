import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { IntroReveal } from "@/components/landing/IntroReveal";
import { ArtOfShoe } from "@/components/landing/ArtOfShoe";
import { CraftSection } from "@/components/landing/CraftSection";
import { LandingSections } from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <IntroReveal>
      <Navbar />
      <main>
        <HeroCarousel />

        <ArtOfShoe id="philosophy" />

        <LandingSections />

        <CraftSection id="craft" />
      </main>
      <Footer />
    </IntroReveal>
  );
}
