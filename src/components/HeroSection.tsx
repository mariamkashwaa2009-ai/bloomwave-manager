import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Waves } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
  onLearnMore: () => void;
}

const HeroSection = ({ onStart, onLearnMore }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero-bg">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-wave-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-wave-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-primary/3 blur-3xl animate-pulse-glow" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            
            <Sparkles className="w-4 h-4" />
            Goal Distribution Made Beautiful
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground font-bold text-6xl">Break It Down. Build It  Up.</span>
            <br />
            <span className="gradient-text">Bloomy Waves</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">Transform overwhelming BLOOMS ''goals'' into structured, executable WAVES "groups''. Distribute participants fairly across difficulty levels — all in your browser.


          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            <Button variant="hero" size="lg" onClick={onStart} className="text-base px-8 py-6">
              <Waves className="w-5 h-5" />
              Start Breaking Your Goals
            </Button>
            <Button variant="heroOutline" size="lg" onClick={onLearnMore} className="text-base px-8 py-6">
              See How It Works
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>);

};

export default HeroSection;