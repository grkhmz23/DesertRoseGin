import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";

// Legal Content Data
type LegalKey = "terms" | "privacy" | "accessibility";

const LEGAL_CONTENT: Record<LegalKey, { title: string; body: JSX.Element }> = {
  terms: {
    title: "Terms and Conditions",
    body: (
      <div className="space-y-5 text-sm leading-relaxed text-[#F7F2E8]/85">
        <section><h3 className="font-semibold text-[#F7F2E8] mb-1">1. Generalities</h3><p>Terms apply to all transactions...</p></section>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <div className="space-y-5 text-sm leading-relaxed text-[#F7F2E8]/85">
        <section><p>Data processing policy...</p></section>
      </div>
    ),
  },
  accessibility: {
    title: "Accessibility",
    body: (
      <div className="space-y-5 text-sm leading-relaxed text-[#F7F2E8]/85">
        <section><p>Accessibility statement...</p></section>
      </div>
    ),
  },
};

export function Footer() {
  const [openDoc, setOpenDoc] = useState<LegalKey | null>(null);
  const current = openDoc ? LEGAL_CONTENT[openDoc] : null;

  return (
    <>
      {/* CLIENT FIX: Changed bg to #2B1810 (Dark Brown) - No Black */}
      <footer className="w-full bg-[#2B1810] text-[#F5EFE6] border-t border-[#CD7E31]/20 pt-16 pb-8 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-12">

          {/* Brand Column */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Desert Rose" className="h-16 w-auto opacity-90" />
              <div className="flex flex-col">
                <span className="font-lux text-2xl tracking-wide text-[#F5EFE6]">Desert Rose</span>
                <span className="font-hud text-[9px] tracking-[0.3em] uppercase text-[#CD7E31]">Est. Switzerland 2020</span>
              </div>
            </div>
            <p className="font-sans font-light text-sm text-[#F5EFE6]/60 leading-relaxed">
              Crafted with the silence of the dunes and the precision of Swiss distillation. 
              A spirit born from heat, wind, and time.
            </p>

            {/* CLIENT FIX: Added Language Menu here */}
            <div className="flex items-center gap-4 mt-2">
              <Globe className="w-3 h-3 text-[#CD7E31]" />
              <div className="flex gap-3 text-[10px] font-hud uppercase tracking-widest text-[#F5EFE6]/60">
                <button className="hover:text-[#CD7E31] transition-colors text-[#CD7E31]">EN</button>
                <button className="hover:text-[#CD7E31] transition-colors">IT</button>
                <button className="hover:text-[#CD7E31] transition-colors">DE</button>
                <button className="hover:text-[#CD7E31] transition-colors">FR</button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <span className="font-hud text-[10px] tracking-[0.2em] uppercase text-[#CD7E31]">Contact</span>
              <div className="flex flex-col gap-2 text-sm text-[#F5EFE6]/70">
                {/* CLIENT FIX: Corrected email domain typo (added 't') */}
                <a href="mailto:info@thedesertrosegin.com" className="hover:text-[#F5EFE6] transition-colors">info@thedesertrosegin.com</a>
                <a href="mailto:orders@thedesertrosegin.com" className="hover:text-[#F5EFE6] transition-colors">orders@thedesertrosegin.com</a>
                <span className="mt-2">+41 91 605 52 63</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-hud text-[10px] tracking-[0.2em] uppercase text-[#CD7E31]">Discover</span>
              <div className="flex flex-col gap-2 text-sm text-[#F5EFE6]/70">
                {/* CLIENT FIX: Added Events link */}
                <a href="#" className="hover:text-[#F5EFE6] transition-colors">Events & Partnerships</a>
                <a href="#" className="hover:text-[#F5EFE6] transition-colors">Instagram</a>
                <a href="#" className="hover:text-[#F5EFE6] transition-colors">Facebook</a>
                <a href="#" className="hover:text-[#F5EFE6] transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-[#CD7E31]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-hud text-[#F5EFE6]/40 tracking-wider">
            © 2025 THE DESERT ROSE GIN CO. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-6">
            {(['terms', 'privacy', 'accessibility'] as LegalKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setOpenDoc(key)}
                className="text-[10px] font-hud uppercase tracking-widest text-[#F5EFE6]/40 hover:text-[#CD7E31] transition-colors"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <AnimatePresence>
        {current && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-[#2B1810]/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-[#2B1810] border border-[#CD7E31]/30 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
            >
              <button onClick={() => setOpenDoc(null)} className="absolute top-6 right-6 text-[#F5EFE6]/60 hover:text-[#CD7E31]">
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-lux text-3xl text-[#F5EFE6] mb-2">{current.title}</h2>
              <div className="w-12 h-0.5 bg-[#CD7E31] mb-6" />
              {current.body}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}