import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { trackContactClick } from "@/lib/analytics";

type LegalKey = "terms" | "privacy" | "accessibility";

export function Footer() {
  const { t } = useTranslation('common');
  const [openDoc, setOpenDoc] = useState<LegalKey | null>(null);
  const legalKeys: LegalKey[] = ["terms", "privacy", "accessibility"];

  // Legal content now uses translations
  const getLegalContent = (key: LegalKey) => {
    if (key === 'terms') {
      return (
        <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.terms.section1_title')}</h3>
            <p>{t('legal.terms.section1_p1')}</p>
            <p className="mt-2">{t('legal.terms.section1_p2')}</p>
            <p className="mt-2">{t('legal.terms.section1_p3')}</p>
            <p className="mt-2">{t('legal.terms.section1_p4')}</p>
          </section>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.terms.section2_title')}</h3>
            <p>{t('legal.terms.section2_p1')}</p>
            <p className="mt-2">{t('legal.terms.section2_p2')}</p>
            <p className="mt-2">{t('legal.terms.section2_p3')}</p>
          </section>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.terms.section3_title')}</h3>
            <p>{t('legal.terms.section3_p1')}</p>
            <p className="mt-2">{t('legal.terms.section3_p2')}</p>
          </section>
        </div>
      );
    } else if (key === 'privacy') {
      return (
        <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
          <p>{t('legal.privacy.intro')}</p>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.controller_title')}</h3>
            <p>{t('legal.privacy.controller_text')}</p>
          </section>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.place_title')}</h3>
            <p>{t('legal.privacy.place_text')}</p>
          </section>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.types_title')}</h3>
            <h4 className="font-light text-[#F7F2E8] mt-3 mb-1">{t('legal.privacy.navigation_title')}</h4>
            <p>{t('legal.privacy.navigation_text')}</p>
          </section>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.cookies_title')}</h3>
            <p>{t('legal.privacy.cookies_text')}</p>
          </section>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
          <p>{t('legal.accessibility.intro')}</p>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.accessibility.compliance_title')}</h3>
            <p>{t('legal.accessibility.compliance_text')}</p>
          </section>
          <section>
            <h3 className="font-light text-[#F7F2E8] mb-2 text-sm">{t('legal.accessibility.usage_title')}</h3>
            <p>{t('legal.accessibility.usage_text')}</p>
          </section>
        </div>
      );
    }
  };

  const modalContent = openDoc ? (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#2B1810]/95 backdrop-blur-md p-4"
        onClick={() => setOpenDoc(null)}
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          // UPDATED: Sharp corners - removed rounded-lg
          className="bg-[#2B1810] border border-[#CD7E31]/25 p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
        >
          <button 
            onClick={() => setOpenDoc(null)} 
            // UPDATED: Sharp corners
            className="absolute top-4 right-4 md:top-6 md:right-6 text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors z-10 bg-[#2B1810]/80 p-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={1.2} />
          </button>

          <h2 className="font-lux text-2xl md:text-3xl text-[#F5EFE6] mb-2 pr-8">
            {t(`legal.${openDoc}.title`)}
          </h2>
          <div className="w-12 h-0.5 bg-[#CD7E31] mb-6" />

          <div className="pr-2">
            {getLegalContent(openDoc)}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;

  return (
    <>
      {/* DESKTOP FOOTER ONLY - Hidden on mobile */}
      <footer className="hidden md:block w-full bg-[#2B1810]/90 backdrop-blur-sm text-[#F5EFE6] border-t border-[#CD7E31]/10 relative z-10 translate-y-2">

        {/* ── TABLET (768–1023px): condensed single row, no overflow ── */}
        <div className="lg:hidden px-4 py-2.5">
          <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.12em] font-light">
            {/* Logo + brand */}
            <div className="flex items-center gap-2 shrink-0 min-w-0">
              <div className="keep-round bg-white p-1 flex items-center justify-center w-8 h-8 shrink-0">
                <img src="/logo.png" alt="Desert Rose" className="h-5 w-auto object-contain" />
              </div>
              <span className="font-ergon text-[#F5EFE6] truncate">Desert Rose Gin</span>
            </div>

            {/* Legal links */}
            <div className="flex items-center gap-2 shrink-0">
              {legalKeys.map((key) => (
                <React.Fragment key={key}>
                  <button
                    onClick={() => setOpenDoc(key)}
                    className="font-ergon font-light text-[8.5px] text-[#F5EFE6]/55 hover:text-[#CD7E31] transition-colors whitespace-nowrap"
                  >
                    {t(`footer.legal.${key}`)}
                  </button>
                  {key !== legalKeys[legalKeys.length - 1] && <span className="text-[#CD7E31]/40 text-[8px]">|</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Copyright */}
            <p className="font-ergon font-light text-[8px] text-[#F5EFE6]/45 shrink-0 whitespace-nowrap">
              {t('footer.copyright')}
            </p>
          </div>
        </div>

        {/* ── DESKTOP (1024px+): full single row ── */}
        <div className="hidden lg:block px-8 py-3">
          <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-none">
            <div className="flex min-w-max items-center justify-between gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.12em] font-light">
              <div className="flex items-center gap-2 shrink-0">
                <div className="keep-round bg-white p-1.5 flex items-center justify-center w-10 h-10 shrink-0">
                  <img src="/logo.png" alt="Desert Rose" className="h-7 w-auto object-contain" />
                </div>
                <span className="font-ergon font-light text-[#F5EFE6]">Desert Rose Gin</span>
                <span className="text-[#CD7E31]/50">|</span>
                <span className="font-ergon font-light text-[#CD7E31]">{t('footer.tagline')}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-[#F5EFE6]/70">
                <a href="mailto:info@thedesertrosegin.com" onClick={() => trackContactClick("email", "info@thedesertrosegin.com")} className="text-[9px] font-light hover:text-[#CD7E31] transition-colors">
                  info@thedesertrosegin.com
                </a>
                <span className="text-[#CD7E31]/40">|</span>
                <a href="mailto:orders@thedesertrosegin.com" onClick={() => trackContactClick("email", "orders@thedesertrosegin.com")} className="text-[9px] font-light hover:text-[#CD7E31] transition-colors">
                  orders@thedesertrosegin.com
                </a>
                <span className="text-[#CD7E31]/40">|</span>
                <a href="tel:+41916055263" onClick={() => trackContactClick("phone", "+41916055263")} className="text-[9px] font-light hover:text-[#CD7E31] transition-colors">
                  +41 91 605 52 63
                </a>
                <span className="text-[#CD7E31]/40">|</span>
                <div className="flex items-center gap-1 leading-tight text-[9px]">
                  <a href="https://www.instagram.com/desert_rosegin_official/" target="_blank" rel="noopener noreferrer" onClick={() => trackContactClick("instagram", "https://www.instagram.com/desert_rosegin_official/")} className="font-light hover:text-[#CD7E31] transition-colors">IG</a>
                  <span className="text-[#CD7E31]/35">/</span>
                  <a href="https://www.linkedin.com/company/the-desert-rose-gin/" target="_blank" rel="noopener noreferrer" onClick={() => trackContactClick("linkedin", "https://www.linkedin.com/company/the-desert-rose-gin/")} className="font-light hover:text-[#CD7E31] transition-colors">IN</a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {legalKeys.map((key) => (
                  <React.Fragment key={key}>
                    <button onClick={() => setOpenDoc(key)} className="font-ergon font-light text-[9px] text-[#F5EFE6]/55 hover:text-[#CD7E31] transition-colors">
                      {t(`footer.legal.${key}`)}
                    </button>
                    {key !== legalKeys[legalKeys.length - 1] && <span className="text-[#CD7E31]/40">|</span>}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-[#F5EFE6]/65">
                <span className="font-ergon font-light normal-case tracking-normal text-[11px]">We are members of</span>
                <a href="https://www.theginguild.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center keep-round bg-white w-10 h-10 shrink-0 overflow-hidden hover:opacity-90 transition-opacity" aria-label="Visit The Gin Guild">
                  <img src="/assets/logos/gin-guild-member-logo.webp" alt="The Gin Guild member logo" className="h-full w-full object-contain scale-[1.18]" />
                </a>
              </div>

              <p className="font-ergon font-light text-[9px] text-[#F5EFE6]/55 shrink-0">
                {t('footer.copyright')}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
