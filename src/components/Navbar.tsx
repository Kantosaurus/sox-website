"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "history", label: "History" },
  { id: "sections", label: "Key Sections" },
  { id: "penalties", label: "Penalties" },
  { id: "compliance", label: "Compliance" },
  { id: "impact", label: "Impact" },
  { id: "criticism", label: "Criticism" },
];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const offsets = sections.map((s) => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el ? el.offsetTop - 120 : 0 };
      });

      const current = offsets
        .filter((o) => window.scrollY >= o.top)
        .pop();
      if (current) setActive(current.id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#252530]/80 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold text-white hover:text-[var(--accent)] transition-colors">
            SOX Guide
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`relative px-3 py-2 text-sm rounded-lg transition-colors ${
                  active === s.id
                    ? "text-white"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="activeSection"
                    className="absolute inset-0 bg-[var(--accent)]/15 rounded-lg border border-[var(--accent)]/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            ))}
            <Link
              href="/quiz"
              className="ml-3 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[#d63050] transition-all hover:shadow-lg hover:shadow-[var(--accent-glow)]"
            >
              🧠 Quiz
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#252530]"
          >
            <div className="px-4 py-3 space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    active === s.id
                      ? "text-white bg-[var(--accent)]/15"
                      : "text-[#888] hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <Link
                href="/quiz"
                className="block w-full text-left px-3 py-2 text-[var(--accent)] font-semibold text-sm"
                onClick={() => setMobileOpen(false)}
              >
                🧠 Pop Quiz
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
