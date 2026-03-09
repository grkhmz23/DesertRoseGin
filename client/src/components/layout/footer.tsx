import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';

type LegalKey = "terms" | "privacy" | "accessibility";

export function Footer() {
  const { t, i18n } = useTranslation('common');
  const [openDoc, setOpenDoc] = useState<LegalKey | null>(null);
  const [showLanguages, setShowLanguages] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'it', name: 'Italiano' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setShowLanguages(false);
  };

  const currentLangCode = (i18n.language || 'en').split('-')[0].toUpperCase();

  // Legal content now uses translations
  const getLegalContent = (key: LegalKey) => {
    if (key === 'terms') {
      return (
        <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.terms.section1_title')}</h3>
            <p>{t('legal.terms.section1_p1')}</p>
            <p className="mt-2">{t('legal.terms.section1_p2')}</p>
            <p className="mt-2">{t('legal.terms.section1_p3')}</p>
            <p className="mt-2">{t('legal.terms.section1_p4')}</p>
          </section>
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.terms.section2_title')}</h3>
            <p>{t('legal.terms.section2_p1')}</p>
            <p className="mt-2">{t('legal.terms.section2_p2')}</p>
            <p className="mt-2">{t('legal.terms.section2_p3')}</p>
          </section>
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.terms.section3_title')}</h3>
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
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.controller_title')}</h3>
            <p>{t('legal.privacy.controller_text')}</p>
          </section>
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.place_title')}</h3>
            <p>{t('legal.privacy.place_text')}</p>
          </section>
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.types_title')}</h3>
            <h4 className="font-medium text-[#F7F2E8] mt-3 mb-1">{t('legal.privacy.navigation_title')}</h4>
            <p>{t('legal.privacy.navigation_text')}</p>
          </section>
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.privacy.cookies_title')}</h3>
            <p>{t('legal.privacy.cookies_text')}</p>
          </section>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 text-xs leading-relaxed text-[#F7F2E8]/85">
          <p>{t('legal.accessibility.intro')}</p>
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.accessibility.compliance_title')}</h3>
            <p>{t('legal.accessibility.compliance_text')}</p>
          </section>
          <section>
            <h3 className="font-semibold text-[#F7F2E8] mb-2 text-sm">{t('legal.accessibility.usage_title')}</h3>
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
          className="bg-[#2B1810] border-2 border-[#CD7E31]/40 p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
        >
          <button 
            onClick={() => setOpenDoc(null)} 
            // UPDATED: Sharp corners
            className="absolute top-4 right-4 md:top-6 md:right-6 text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors z-10 bg-[#2B1810]/80 p-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
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
      <footer className="hidden md:block w-full bg-[#2B1810]/90 backdrop-blur-sm text-[#F5EFE6] border-t border-[#CD7E31]/20 pt-3 pb-2 lg:pt-4 lg:pb-3 px-4 md:px-8 lg:px-12 relative z-10 translate-y-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-5 xl:gap-6 items-center">

            <div className="flex items-center justify-center lg:justify-start gap-3">
              {/* Logo wrapped in white circle */}
              <div className="keep-round bg-white p-1.5 flex items-center justify-center w-12 h-12">
                <img src="/logo.png" alt="Desert Rose" className="h-8 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-ergon text-[10px] lg:text-[11px] tracking-[0.14em] uppercase text-[#F5EFE6]">Desert Rose Gin</span>
                <span className="font-ergon text-[10px] lg:text-[11px] tracking-[0.14em] uppercase text-[#CD7E31]">{t('footer.tagline')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-2 sm:gap-4 text-[10px] lg:text-[11px] text-[#F5EFE6]/70 xl:col-span-2 tracking-[0.14em] uppercase">
              <a href="mailto:info@thedesertrosegin.com" className="hover:text-[#CD7E31] transition-colors">
                info@thedesertrosegin.com
              </a>
              <a href="mailto:orders@thedesertrosegin.com" className="hover:text-[#CD7E31] transition-colors">
                orders@thedesertrosegin.com
              </a>
              <span>+41 91 605 52 63</span>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-[10px] lg:text-[11px] text-[#F5EFE6]/70 tracking-[0.14em] uppercase">
              <a 
                href="https://www.instagram.com/desert_rosegin_official/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#CD7E31] transition-colors"
              >
                Instagram
              </a>
            </div>

            <div className="relative flex justify-center lg:justify-start">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 px-3 py-1.5 text-[10px] lg:text-[11px] text-[#F5EFE6]/70 hover:text-[#CD7E31] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-ergon tracking-[0.14em] uppercase">{currentLangCode}</span>
              </button>

              {showLanguages && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  // UPDATED: Sharp corners - removed rounded-lg
                  className="absolute bottom-full right-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0 mb-2 bg-[#2B1810] border border-[#CD7E31]/30 overflow-hidden shadow-xl"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`block w-full px-4 py-2 text-left text-xs font-ergon hover:bg-[#CD7E31]/20 transition-colors ${
                        (i18n.language || 'en').startsWith(lang.code) ? 'text-[#CD7E31]' : 'text-[#F5EFE6]/70'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-center xl:justify-end gap-3 xl:gap-4">
              {(['terms', 'privacy', 'accessibility'] as LegalKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setOpenDoc(key)}
                  className="text-[10px] lg:text-[11px] font-ergon uppercase tracking-[0.18em] text-[#F5EFE6]/55 hover:text-[#CD7E31] transition-colors"
                >
                  {t(`footer.legal.${key}`)}
                </button>
              ))}
            </div>

            <p className="text-[10px] lg:text-[11px] text-center xl:text-right font-ergon text-[#F5EFE6]/55 tracking-[0.14em]">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>

      {typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
