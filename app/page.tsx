import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AboutSection from "@/components/landing/AboutSection";
import AnnouncementsPreview from "@/components/landing/AnnouncementsPreview";
import ContactSection from "@/components/landing/ContactSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main>
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <AnnouncementsPreview />
      <ContactSection />
      <LandingFooter />
    </main>
  );
}
