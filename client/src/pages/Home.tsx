/*
 * DIMI Landing Page
 * Design: Minimal Manifesto — clean white, olive accent, Space Grotesk typography
 * Layout: Full-viewport sections, left-aligned hero, single-column flow
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const HERO_WORDS = ["live,", "together."];

const CTA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663267369814/NRkmTJ8GEcJfdTrHZf8aiP/dimi-cta-bg-Qn8KDzNeG59f22sULFPRKw.webp";

function AnimatedWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={HERO_WORDS[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-olive"
        >
          {HERO_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-olive/20 selection:text-olive-dark">
      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
          <a
            href="/"
            className="text-foreground font-bold text-xl tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            DIMI.
          </a>
          <div className="hidden sm:flex items-center gap-8">
            <a
              href="#features"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.15em] uppercase font-medium"
            >
              Platform
            </a>
            <a
              href="#waitlist"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.15em] uppercase font-medium"
            >
              Access
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto pt-24 pb-16">
        <FadeInSection>
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-8 font-medium">
            Music Creation Infrastructure
          </p>
        </FadeInSection>

        <FadeInSection delay={0.12}>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.95] tracking-tight text-foreground mb-8">
            Where music
            <br />
            gets made
            <br />
            <AnimatedWord />
          </h1>
        </FadeInSection>

        <FadeInSection delay={0.24}>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-10">
            Not another DAW. Not a social app. DIMI is the collaboration and
            streaming layer that plugs into the tools producers already trust.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.36}>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center px-8 py-4 bg-olive text-white font-semibold text-xs tracking-[0.15em] uppercase hover:bg-olive-dark transition-colors duration-300"
            >
              Request Access
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground/15 text-foreground font-semibold text-xs tracking-[0.15em] uppercase hover:border-foreground/40 transition-colors duration-300"
            >
              See How It Works
            </a>
          </div>
        </FadeInSection>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section
        id="features"
        className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto"
      >
        <FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-foreground/10">
            {/* Feature 1 */}
            <div className="border-b md:border-b-0 md:border-r border-foreground/10 py-10 md:py-14 md:pr-10">
              <div className="text-6xl sm:text-7xl font-bold text-olive mb-3 leading-none">
                3
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1 font-medium">
                Real-time
              </div>
              <div className="text-lg font-semibold text-foreground tracking-tight">
                DAW Integrations
              </div>
            </div>

            {/* Feature 2 */}
            <div className="border-b md:border-b-0 md:border-r border-foreground/10 py-10 md:py-14 md:px-10">
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 font-medium">
                Session Sync
              </div>
              <div className="text-lg font-semibold text-foreground tracking-tight mb-2">
                On-chain 1-click
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">
                Ownership Proofs
              </div>
            </div>

            {/* Feature 3 */}
            <div className="py-10 md:py-14 md:pl-10">
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 font-medium">
                On-chain 1-click
              </div>
              <div className="text-lg font-semibold text-foreground tracking-tight">
                Session Start
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ===== MARQUEE SECTION ===== */}
      <section className="py-6 overflow-hidden border-y border-foreground/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-olive mx-6 shrink-0"
            >
              Early Access
              <span className="mx-3 text-olive/40">&middot;</span>
              Limited Spots
              <span className="mx-3 text-olive/40">&middot;</span>
            </span>
          ))}
        </div>
      </section>

      {/* ===== CTA / WAITLIST SECTION ===== */}
      <section
        id="waitlist"
        className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 overflow-hidden"
      >
        {/* Subtle background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${CTA_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-3">
              Build music.
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-olive leading-[1.05] tracking-tight mb-10">
              Live. Together.
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed">
              Join the waitlist and be first to get DIMI when the FL Studio
              plugin drops.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.24}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-3.5 bg-white border border-foreground/15 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-olive transition-colors duration-300"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-olive text-white font-semibold text-xs tracking-[0.15em] uppercase hover:bg-olive-dark transition-colors duration-300 whitespace-nowrap"
              >
                {submitted ? "Added!" : "Get Access →"}
              </button>
            </form>
            <p className="text-xs text-muted-foreground/50 tracking-wide">
              No spam. We ship, then we notify.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-14 px-6 sm:px-8 lg:px-12 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className="text-olive font-bold text-xl tracking-tight mb-7"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            DIMI
          </div>
          <div className="flex items-center justify-center gap-6 sm:gap-8 mb-7 flex-wrap">
            <a
              href="#"
              className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Platform
            </a>
            <a
              href="#"
              className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Developers
            </a>
            <a
              href="#"
              className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Discord
            </a>
            <a
              href="#"
              className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Twitter
            </a>
          </div>
          <p className="text-[11px] text-muted-foreground/40">
            &copy; 2026 DIMI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
