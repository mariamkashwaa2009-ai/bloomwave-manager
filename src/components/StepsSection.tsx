import { motion } from "framer-motion";
import { Layers, Users, Target, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Layers,
    title: "Define Framework",
    description: "Set the number of Waves (groups) and Blooms (goals) to structure your project.",
    step: 1,
  },
  {
    icon: Users,
    title: "Add Participants",
    description: "Enter participant names — one per line. The tool ensures no duplicates.",
    step: 2,
  },
  {
    icon: Target,
    title: "Set Bloom Weights",
    description: "Name each goal and assign difficulty levels: Low, Medium, or High.",
    step: 3,
  },
  {
    icon: BarChart3,
    title: "View Results",
    description: "See your fair distribution with animated cards, difficulty tags, and a verification seed.",
    step: 4,
  },
];

const StepsSection = () => {
  return (
    <section className="py-24 bg-background" id="how-it-works">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four simple steps to transform chaos into clarity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative group"
            >
              <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 h-full border border-border/50">
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                  Step {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
