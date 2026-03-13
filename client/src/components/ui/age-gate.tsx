import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface AgeGateProps {
  onVerify?: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps) {
  const { t } = useTranslation('common');
  useEffect(() => {
    // Lock body scroll when age gate is visible
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleConfirm = () => {
    // Unlock body scroll
    document.body.style.overflow = "unset";

    // Call the callback from AppShell
    if (onVerify) {
      onVerify();
    }
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      <motion.div
        key="age-gate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[20000] flex items-center justify-center px-6"
      >
        {/* Background: deep desert gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810] via-[#4E3022] to-[#2B1810]" />

        {/* Subtle grain */}
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light pointer-events-none bg-[url('/textures/stardust.png')]" />

        {/* Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative max-w-md w-full border border-[#C79A5A]/25 bg-gradient-to-b from-[#2B1810]/90 via-[#4E3022]/95 to-[#2B1810]/98 px-8 py-10 shadow-2xl"
        >
          {/* Brand mark */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#C79A5A]/35">
              <span className="font-lux tracking-[0.25em] text-xs text-[#C79A5A]">DR</span>
            </div>
            <h1 className="mt-5 font-lux text-3xl tracking-wide text-[#F7F2E8]">Desert Rose Gin</h1>
            <p className="mt-2 font-hud text-[10px] uppercase tracking-[0.3em] text-[#C79A5A]/70">
              {t('ui.ageGate.subtitle')}
            </p>
          </div>

          {/* Copy */}
          <p className="font-body text-sm text-[#F7F2E8]/80 leading-relaxed mb-6 text-center">
            {t('ui.ageGate.message')}
          </p>

          {/* Actions */}
          <div className="space-y-3 mt-6">
            <button 
              onClick={handleConfirm} 
              className="w-full font-hud text-[11px] uppercase tracking-[0.25em] px-6 py-3 border border-[#C79A5A]/60 text-[#C79A5A] hover:bg-[#C79A5A] hover:text-[#2B1810] transition-colors duration-300"
            >
              {t('ui.ageGate.enter')}
            </button>
            <button 
              onClick={handleExit} 
              className="w-full font-hud text-[10px] uppercase tracking-[0.25em] px-6 py-2 text-[#F7F2E8]/60 hover:text-[#F7F2E8] hover:bg-white/5 transition-colors duration-300"
            >
              {t('ui.ageGate.exit')}
            </button>
          </div>

          <p className="mt-5 text-[10px] font-hud text-[#F7F2E8]/35 tracking-[0.2em] text-center">
            {t('ui.product.responsibly')}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
