import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

interface CTASectionProps {
  onStart: () => void;
}

const CTASection = ({ onStart }: CTASectionProps) => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Structuring Your Goals Today
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            No signup. No backend. Just open and go.
          </p>
          <Button variant="hero" size="lg" onClick={onStart} className="text-base px-10 py-6">
            <Rocket className="w-5 h-5" />
            Launch Bloomy Waves
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
