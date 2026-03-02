import { Waves } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <Waves className="w-5 h-5 text-primary" />
            Bloomy Waves
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">Features</a>
            <a href="#tool" className="hover:text-foreground transition-colors">Tool</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <span className="hidden sm:inline">·</span>
            <span>Privacy</span>
            <span>Terms</span>
          </nav>
          <p className="text-xs text-muted-foreground">
            © 2026 Bloomy Waves. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
