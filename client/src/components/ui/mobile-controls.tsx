"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Instagram, FileText, Shield, Accessibility } from "lucide-react";
import { useTranslation } from 'react-i18next';

type LegalKey = "terms" | "privacy" | "accessibility";

export function MobileControls() {
  const { t } = useTranslation('common');
  const [showContact, setShowContact] = useState(false);
  const [openLegalDoc, setOpenLegalDoc] = useState<LegalKey | null>(null);

  const handleLegalClick = (key: LegalKey) => {
    setShowContact(false);
    setOpenLegalDoc(key);
  };

  // Legal content - same as footer
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

  return (
    <>
      {/* Floating buttons - Mobile + Tablet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-[80] flex items-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowContact(true)}
          className="h-9 sm:h-10 px-3 sm:px-4 bg-[#2B1810]/90 border border-[#CD7E31]/20 backdrop-blur-sm flex items-center justify-center text-[#F5EFE6]/70 hover:text-[#CD7E31] transition-colors shadow-lg"
        >
          <span className="font-hud text-[10px] uppercase tracking-wider">{t('ui.contact.open')}</span>
        </motion.button>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[999] flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#2B1810] border-t border-[#CD7E31]/15 p-5 pb-8"
            >
              {/* Handle bar */}
              <div className="w-10 h-1 bg-[#F5EFE6]/20 mx-auto mb-4" />

              {/* Close button */}
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 text-[#F5EFE6]/50 hover:text-[#CD7E31]"
              >
                <X className="w-5 h-5" strokeWidth={1.2} />
              </button>

              {/* Header */}
              <h3 className="font-lux text-lg text-[#F5EFE6] mb-1">{t('ui.contact.title')}</h3>
              <div className="w-8 h-0.5 bg-[#CD7E31] mb-4" />

              {/* Contact Info - sharp corners */}
              <div className="space-y-3">
                <a 
                  href="mailto:info@thedesertrosegin.com"
                  className="flex items-center gap-3 p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#CD7E31]" strokeWidth={1.2} />
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">{t('ui.contact.email')}</p>
                    <p className="text-sm text-[#F5EFE6]">info@thedesertrosegin.com</p>
                  </div>
                </a>

                <a 
                  href="mailto:orders@thedesertrosegin.com"
                  className="flex items-center gap-3 p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#CD7E31]" />
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">{t('ui.contact.orders')}</p>
                    <p className="text-sm text-[#F5EFE6]">orders@thedesertrosegin.com</p>
                  </div>
                </a>

                <a 
                  href="tel:+41916055263"
                  className="flex items-center gap-3 p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#CD7E31]" strokeWidth={1.2} />
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">{t('ui.contact.phone')}</p>
                    <p className="text-sm text-[#F5EFE6]">+41 91 605 52 63</p>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/desert_rosegin_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#CD7E31]" strokeWidth={1.2} />
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">{t('ui.contact.instagram')}</p>
                    <p className="text-sm text-[#F5EFE6]">@desert_rosegin_official</p>
                  </div>
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[#F5EFE6]/8">
                <button 
                  onClick={() => handleLegalClick('terms')}
                  className="text-[9px] font-ergon uppercase tracking-widest text-[#F5EFE6]/40 hover:text-[#CD7E31] transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" strokeWidth={1.2} />
                  {t('footer.legal.terms')}
                </button>
                <button 
                  onClick={() => handleLegalClick('privacy')}
                  className="text-[9px] font-ergon uppercase tracking-widest text-[#F5EFE6]/40 hover:text-[#CD7E31] transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" strokeWidth={1.2} />
                  {t('footer.legal.privacy')}
                </button>
                <button 
                  onClick={() => handleLegalClick('accessibility')}
                  className="text-[9px] font-ergon uppercase tracking-widest text-[#F5EFE6]/40 hover:text-[#CD7E31] transition-colors flex items-center gap-1"
                >
                  <Accessibility className="w-3 h-3" strokeWidth={1.2} />
                  {t('footer.legal.accessibility')}
                </button>
              </div>

              {/* Copyright */}
              <p className="text-[8px] text-[#F5EFE6]/30 text-center mt-4 font-ergon tracking-wider">
                © 2026 DESERT ROSE GIN CO.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Document Modal - sharp corners */}
      <AnimatePresence>
        {openLegalDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[9999] flex items-center justify-center bg-[#2B1810]/95 backdrop-blur-md p-4"
            onClick={() => setOpenLegalDoc(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2B1810] border border-[#CD7E31]/25 p-5 w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            >
              <button
                onClick={() => setOpenLegalDoc(null)}
                className="absolute top-3 right-3 text-[#F5EFE6]/60 hover:text-[#CD7E31] transition-colors z-10 bg-[#2B1810]/80 p-2"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={1.2} />
              </button>

              <h2 className="font-lux text-xl text-[#F5EFE6] mb-2 pr-8">
                {t(`legal.${openLegalDoc}.title`)}
              </h2>
              <div className="w-12 h-0.5 bg-[#CD7E31] mb-4" />

              <div className="pr-2">
                {getLegalContent(openLegalDoc)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
