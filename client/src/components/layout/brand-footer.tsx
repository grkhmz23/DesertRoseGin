import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Linkedin, Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { trackContactClick } from "@/lib/analytics";

type LegalKey = "terms" | "privacy" | "accessibility";

export function BrandFooter() {
  const { t } = useTranslation('common');
  const [openDoc, setOpenDoc] = useState<LegalKey | null>(null);
  const legalKeys: LegalKey[] = ["terms", "privacy", "accessibility"];

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
        key="brand-footer-modal"
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
          className="bg-[#2B1810] border border-[#CD7E31]/25 p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
        >
          <button
            onClick={() => setOpenDoc(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors z-10 bg-[#2B1810]/80 p-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={1.2} />
          </button>
          <h2 className="font-ergon-light text-2xl md:text-3xl text-[#F5EFE6] mb-2 pr-8">
            {t(`legal.${openDoc}.title`)}
          </h2>
          <div className="w-12 h-0.5 bg-[#CD7E31] mb-6" />
          <div className="pr-2">{getLegalContent(openDoc)}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;

  return (
    <>
      <footer className="w-full py-8 px-4 text-[#F5EFE6]">
        {/* Logo + brand name */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-14 h-14">
            <img src="/logo-transparent.png" alt="Desert Rose Gin" className="h-14 w-auto object-contain" />
          </div>
          <p className="font-ergon-light text-base tracking-[0.25em] text-[#F5EFE6]/90 uppercase">
            Desert Rose Gin
          </p>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <a
            href="https://www.instagram.com/desert_rosegin_official/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactClick("instagram", "https://www.instagram.com/desert_rosegin_official/")}
            className="w-10 h-10 rounded-full border border-[#F5EFE6]/25 flex items-center justify-center text-[#F5EFE6]/70 hover:border-[#CD7E31] hover:text-[#CD7E31] transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={15} strokeWidth={1.4} />
          </a>
          <a
            href="https://www.linkedin.com/company/the-desert-rose-gin/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactClick("linkedin", "https://www.linkedin.com/company/the-desert-rose-gin/")}
            className="w-10 h-10 rounded-full border border-[#F5EFE6]/25 flex items-center justify-center text-[#F5EFE6]/70 hover:border-[#CD7E31] hover:text-[#CD7E31] transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={15} strokeWidth={1.4} />
          </a>
          <a
            href="mailto:info@thedesertrosegin.com"
            onClick={() => trackContactClick("email", "info@thedesertrosegin.com")}
            className="w-10 h-10 rounded-full border border-[#F5EFE6]/25 flex items-center justify-center text-[#F5EFE6]/70 hover:border-[#CD7E31] hover:text-[#CD7E31] transition-colors duration-300"
            aria-label="Email"
          >
            <Mail size={15} strokeWidth={1.4} />
          </a>
        </div>

        {/* Contact details */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-5">
          <a
            href="mailto:info@thedesertrosegin.com"
            onClick={() => trackContactClick("email", "info@thedesertrosegin.com")}
            className="font-ergon-light text-[10px] text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors duration-300"
          >
            info@thedesertrosegin.com
          </a>
          <span className="text-[#CD7E31]/35 text-[9px]">|</span>
          <a
            href="mailto:orders@thedesertrosegin.com"
            onClick={() => trackContactClick("email", "orders@thedesertrosegin.com")}
            className="font-ergon-light text-[10px] text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors duration-300"
          >
            orders@thedesertrosegin.com
          </a>
          <span className="text-[#CD7E31]/35 text-[9px]">|</span>
          <a
            href="tel:+41916055263"
            onClick={() => trackContactClick("phone", "+41916055263")}
            className="font-ergon-light text-[10px] text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors duration-300"
          >
            +41 91 605 52 63
          </a>
        </div>

        {/* Legal links */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {legalKeys.map((key, i) => (
            <React.Fragment key={key}>
              <button
                onClick={() => setOpenDoc(key)}
                className="font-ergon-light text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]/50 hover:text-[#CD7E31] transition-colors duration-300"
              >
                {t(`footer.legal.${key}`)}
              </button>
              {i < legalKeys.length - 1 && (
                <span className="text-[#CD7E31]/35 text-[9px]">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Gin Guild membership */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="font-ergon-light text-[10px] uppercase tracking-[0.16em] text-[#F5EFE6]/45 normal-case">
            We are members of
          </span>
          <a
            href="https://www.theginguild.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Visit The Gin Guild"
          >
            <img
              src="/assets/logos/gin-guild-member-logo.png"
              alt="The Gin Guild member logo"
              className="h-full w-full object-contain scale-[1.18]"
              style={{ mixBlendMode: 'screen' }}
            />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center font-ergon-light text-[9px] uppercase tracking-[0.14em] text-[#F5EFE6]/35 mt-4">
          {t('footer.copyright')}
        </p>
      </footer>

      {typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
