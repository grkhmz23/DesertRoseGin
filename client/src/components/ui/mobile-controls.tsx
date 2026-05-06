"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Instagram, Linkedin, FileText, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { trackContactClick } from "@/lib/analytics";
import { getLegalPolicy, legalPolicyKeys, type LegalPolicyKey } from "@/lib/legal-policies";

export function MobileControls() {
  const { t, i18n } = useTranslation('common');
  const [showContact, setShowContact] = useState(false);
  const [openLegalDoc, setOpenLegalDoc] = useState<LegalPolicyKey | null>(null);
  const activePolicy = openLegalDoc ? getLegalPolicy(i18n.language, openLegalDoc) : null;

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
                  onClick={() => trackContactClick("email", "info@thedesertrosegin.com")}
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
                  onClick={() => trackContactClick("email", "orders@thedesertrosegin.com")}
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
                  onClick={() => trackContactClick("phone", "+41916055263")}
                  className="flex items-center gap-3 p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#CD7E31]" strokeWidth={1.2} />
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">{t('ui.contact.phone')}</p>
                    <p className="text-sm text-[#F5EFE6]">+41 91 605 52 63</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/thedesertrosegin_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick("instagram", "https://www.instagram.com/thedesertrosegin_official")}
                  className="flex items-center gap-3 p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#CD7E31]" strokeWidth={1.2} />
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">{t('ui.contact.instagram')}</p>
                    <p className="text-sm text-[#F5EFE6]">@thedesertrosegin_official</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/company/the-desert-rose-gin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick("linkedin", "https://www.linkedin.com/company/the-desert-rose-gin/")}
                  className="flex items-center gap-3 p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#CD7E31]" strokeWidth={1.2} />
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">LinkedIn</p>
                    <p className="text-sm text-[#F5EFE6]">The Desert Rose Gin</p>
                  </div>
                </a>
              </div>

              {/* Gin Guild Membership */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F5EFE6]/8">
                <a
                  href="https://www.theginguild.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-3 bg-[#F5EFE6]/5 hover:bg-[#CD7E31]/10 transition-colors"
                >
                  <div className="keep-round bg-white w-8 h-8 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="/assets/logos/gin-guild-member-logo.webp" alt="The Gin Guild" className="h-full w-full object-contain scale-[1.18]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#F5EFE6]/50 uppercase tracking-wider">We are members of</p>
                    <p className="text-sm text-[#F5EFE6]">The Gin Guild</p>
                  </div>
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-[#F5EFE6]/8">
                {legalPolicyKeys.map((key, index) => {
                  const policy = getLegalPolicy(i18n.language, key);
                  const Icon = index === 1 ? Shield : FileText;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setShowContact(false);
                        setOpenLegalDoc(key);
                      }}
                      className="text-[9px] font-ergon uppercase tracking-widest text-[#F5EFE6]/40 hover:text-[#CD7E31] transition-colors flex items-center gap-1"
                    >
                      <Icon className="w-3 h-3" strokeWidth={1.2} />
                      {policy.shortLabel}
                    </button>
                  );
                })}
              </div>

              {/* Copyright */}
              <div className="mt-4 text-center font-ergon text-[8px] uppercase tracking-wider text-[#F5EFE6]/35">
                <p>{t('footer.salesNote.line1')}</p>
                <p className="mt-1 text-[#CD7E31]/60">{t('footer.salesNote.line2')}</p>
              </div>
              <p className="text-[8px] text-[#F5EFE6]/30 text-center mt-4 font-ergon tracking-wider">
                © 2026 DESERT ROSE GIN CO.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Document Modal - sharp corners */}
      <AnimatePresence>
        {activePolicy && (
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
                {activePolicy.title}
              </h2>
              <div className="w-12 h-0.5 bg-[#CD7E31] mb-4" />

              <div className="space-y-5 pr-2 text-xs leading-relaxed text-[#F7F2E8]/85">
                {activePolicy.updated ? (
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#CD7E31]/80">{activePolicy.updated}</p>
                ) : null}
                {activePolicy.sections.map((section) => (
                  <section key={section.title}>
                    <h3 className="mb-2 text-sm font-semibold text-[#F7F2E8]">{section.title}</h3>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mt-2">{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
