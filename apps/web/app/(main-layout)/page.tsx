import BenefitsSection from "@/components/home-screen/benefits";
import CTASection from "@/components/home-screen/cta";
import FAQSection from "@/components/home-screen/faq";
import FeaturesSection from "@/components/home-screen/features-section";
import HeroSection from "@/components/home-screen/hero";
import HowItWorksSection from "@/components/home-screen/how-it-works";
import Marquee from "@/components/home-screen/marquee";
import StatsSection from "@/components/home-screen/stats";
import TemplatePreviewSection from "@/components/home-screen/template-preview";
import TestimonialsSection from "@/components/home-screen/testimonials";
import WhyChooseUsSection from "@/components/home-screen/why-choose-us";

export default function Page() {
  return (
    <>
      <HeroSection />
      <Marquee />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatePreviewSection />
      <WhyChooseUsSection />
      <BenefitsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
