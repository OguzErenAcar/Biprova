import { Suspense } from "react";
import { LandingNav } from "./_components/landing-nav";
import { HeroSection } from "./_components/hero-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { ProjectsSection } from "./_components/projects-section";
import { WhySection } from "./_components/why-section";
import { CtaSection } from "./_components/cta-section";
import { LandingFooter } from "./_components/landing-footer";

export default function LandingPage() {
  return (
    <>
      <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-[100] h-[65px] bg-white/85 backdrop-blur-[16px] border-b border-slate-200" />}>
        <LandingNav />
      </Suspense>
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ProjectsSection />
        <WhySection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
