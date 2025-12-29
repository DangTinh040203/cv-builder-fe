import BenefitsSection from "@/components/HomeScreen/benefits";
import CTASection from "@/components/HomeScreen/cta";
import FAQSection from "@/components/HomeScreen/faq";
import FeaturesSection from "@/components/HomeScreen/features-section";
import HeroSection from "@/components/HomeScreen/hero";
import HowItWorksSection from "@/components/HomeScreen/how-it-works";
import Marquee from "@/components/HomeScreen/marquee";
import StatsSection from "@/components/HomeScreen/stats";
import TemplatePreviewSection from "@/components/HomeScreen/template-preview";
import TestimonialsSection from "@/components/HomeScreen/testimonials";
import WhyChooseUsSection from "@/components/HomeScreen/why-choose-us";

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
