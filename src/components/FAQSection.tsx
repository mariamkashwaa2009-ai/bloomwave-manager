import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What is Bloomy Waves?", a: "Bloomy Waves is a client-side tool that helps you break down large goals ('Blooms') into manageable groups ('Waves') and fairly distribute participants across them based on difficulty." },
  { q: "Who is this tool for?", a: "Team leads, project managers, educators, event organizers — anyone needing to distribute people across tasks fairly and transparently." },
  { q: "How does it differ from a simple to-do list?", a: "Unlike to-do lists, Bloomy Waves considers difficulty weighting, group sizing, and fair randomized distribution. It structures goals into executable phases." },
  { q: "Can it handle large businesses and enterprise-level teams?", a: "Yes! The tool is optimized to handle up to 10,000 participants and 10,000 goals without performance issues." },
  { q: "How scalable is it?", a: "Extremely scalable. The distribution algorithm runs in milliseconds even at maximum capacity, all within your browser." },
  { q: "Can it support competitions or giveaways?", a: "Absolutely. Use the fairness verification seed to prove random, unbiased distribution — perfect for contests and giveaways." },
  { q: "How does the tool reduce overwhelm?", a: "By breaking large goals into waves with assigned participants, everyone knows exactly what they're responsible for — no ambiguity." },
  { q: "Can it be customized for different industries?", a: "Yes. The wave/bloom framework is flexible enough for software teams, classrooms, marketing campaigns, and more." },
  { q: "How is fairness ensured?", a: "Participants are shuffled randomly using a seeded algorithm. The hardest goals are assigned to the largest groups. The seed is displayed for verification." },
  { q: "Are animations included?", a: "Yes! Results appear with smooth animations, cards transition beautifully between steps, and hover effects provide tactile feedback throughout." },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-secondary/30" id="faq">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know about Bloomy Waves.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card rounded-lg border border-border/50 px-6 shadow-card"
              >
                <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
