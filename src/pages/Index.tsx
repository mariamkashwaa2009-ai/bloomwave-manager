import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import StepsSection from "@/components/StepsSection";
import ToolSection from "@/components/ToolSection";
import VerificationSection from "@/components/VerificationSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  const toolRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSteps = () => {
    stepsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onStart={scrollToTool} onLearnMore={scrollToSteps} />
      <div ref={stepsRef}>
        <StepsSection />
      </div>
      <div ref={toolRef}>
        <ToolSection />
      </div>
      <FAQSection />
      <CTASection onStart={scrollToTool} />
      <FooterSection />
    </div>
  );
};

export default Index;
