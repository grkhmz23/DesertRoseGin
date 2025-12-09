import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AGE_STORAGE_KEY = "drg_age_confirmed";

interface AgeGateProps {
  children: ReactNode;
}

export function AgeGate({ children }: AgeGateProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Read existing confirmation from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AGE_STORAGE_KEY);
      if (stored === "true") {
        setIsConfirmed(true);
      }
    } catch {
      // ignore storage errors, user will just see the gate again
    }
    setIsLoaded(true);
  }, []);

  const handleConfirm = () => {
    try {
      window.localStorage.setItem(AGE_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setIsConfirmed(true);
  };

  const handleExit = () => {
    // Simple behaviour: send user away from the brand site
    window.location.href = "https://www.google.com";
  };

  if (!isLoaded) return null;

  return (
    <>
      <AnimatePresence>
        {!isConfirmed && (
          <motion.div
            key="age-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[10000] flex items-center justify-center px-6"
          >
            {/* Background: deep desert gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810] via-[#4E3022] to-[#2B1810]" />

            {/* Subtle grain */}
            <div className="absolute inset-0 opacity-20 mix-blend-soft-light pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* Card */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative max-w-md w-full border border-[#C79A5A]/40 bg-gradient-to-b from-[#2B1810]/90 via-[#4E3022]/95 to-[#2B1810]/98 px-8 py-10 shadow-2xl"
            >
              {/* Decorative top line */}
              <div className="absolute inset-x-10 top-6 h-px bg-gradient-to-r from-transparent via-[#C79A5A]/60 to-transparent" />

              {/* Brand mark */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#C79A5A]/60">
                  <span className="font-lux tracking-[0.25em] text-xs text-[#C79A5A]">
                    DR
                  </span>
                </div>
                <h1 className="mt-5 font-lux text-3xl tracking-wide text-[#F7F2E8]">
                  Desert Rose Gin
                </h1>
                <p className="mt-2 font-hud text-[10px] uppercase tracking-[0.3em] text-[#C79A5A]/70">
                  London Dry · Saharan Inspired
                </p>
              </div>

              {/* Copy */}
              <p className="font-body text-sm text-[#F7F2E8]/80 leading-relaxed mb-6">
                To enter this experience, you must be of legal drinking age in your
                country of residence. By selecting{" "}
                <span className="font-semibold text-[#F7F2E8]">Enter</span>, you
                confirm that you meet the legal drinking age requirement.
              </p>

              {/* Actions */}
              <div className="space-y-3 mt-6">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full font-hud text-[11px] uppercase tracking-[0.25em] px-6 py-3 border border-[#C79A5A] text-[#C79A5A] hover:bg-[#C79A5A] hover:text-[#2B1810] transition-colors duration-300"
                  data-testid="button-age-confirm"
                >
                  Enter
                </button>

                <button
                  type="button"
                  onClick={handleExit}
                  className="w-full font-hud text-[10px] uppercase tracking-[0.25em] px-6 py-2 text-[#F7F2E8]/60 hover:text-[#F7F2E8] hover:bg-white/5 transition-colors duration-300"
                  data-testid="button-age-exit"
                >
                  I am not of legal age
                </button>
              </div>

              {/* Legal hint */}
              <p className="mt-5 text-[10px] font-hud text-[#F7F2E8]/35 tracking-[0.2em] text-center">
                PLEASE ENJOY DESERT ROSE RESPONSIBLY
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Underlying app content */}
      <div className={!isConfirmed ? "h-screen overflow-hidden blur-sm" : ""}>
        {children}
      </div>
    </>
  );
}
