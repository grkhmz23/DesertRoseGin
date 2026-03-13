"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "desert-rose-cookie-consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 sm:pb-6 lg:px-8"
        >
          {/* Backdrop blur for luxury feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810]/90 via-[#2B1810]/60 to-transparent pointer-events-none" />

          {/* Banner Container */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="relative overflow-hidden rounded-lg border border-[#CD7E31]/30 bg-gradient-to-br from-[#2B1810]/95 via-[#3D2419]/95 to-[#2B1810]/95 backdrop-blur-md shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#CD7E31]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#CD7E31]/30 to-transparent" />

              {/* Close button - desktop only */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 text-[#E8DCCA]/50 hover:text-[#E8DCCA] transition-colors duration-300 hidden sm:block"
                aria-label="Close cookie banner"
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              <div className="px-5 py-5 sm:px-8 sm:py-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
                {/* Icon and Text */}
                <div className="flex items-start gap-4 lg:gap-5">
                  {/* Cookie Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#CD7E31]/40 bg-gradient-to-br from-[#CD7E31]/20 to-[#CD7E31]/5 flex items-center justify-center">
                      <Cookie 
                        size={24} 
                        className="text-[#CD7E31]" 
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-lux text-base sm:text-lg text-[#E8DCCA] tracking-wide mb-1.5 sm:mb-2">
                      Your Privacy Matters
                    </h3>
                    <p className="text-[0.75rem] sm:text-sm text-[#E8DCCA]/70 leading-relaxed font-ergon-light max-w-xl">
                      We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                      By clicking &quot;Accept&quot;, you consent to our use of cookies.
                    </p>
                    <a
                      href="/privacy"
                      className="inline-block mt-2 text-[0.7rem] sm:text-xs text-[#CD7E31] hover:text-[#E8DCCA] transition-colors duration-300 underline underline-offset-2"
                    >
                      Read our Privacy Policy
                    </a>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
                  <button
                    onClick={handleDecline}
                    className="order-2 sm:order-1 px-5 py-2.5 sm:px-6 sm:py-3 text-[0.7rem] sm:text-xs font-hud tracking-[0.15em] uppercase text-[#E8DCCA]/80 border border-[#E8DCCA]/30 hover:border-[#E8DCCA]/60 hover:bg-[#E8DCCA]/5 transition-all duration-300 rounded-sm"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="order-1 sm:order-2 px-5 py-2.5 sm:px-6 sm:py-3 text-[0.7rem] sm:text-xs font-hud tracking-[0.15em] uppercase text-[#2B1810] bg-[#CD7E31] hover:bg-[#d68b40] transition-all duration-300 rounded-sm shadow-lg shadow-[#CD7E31]/20"
                  >
                    Accept Cookies
                  </button>
                </div>
              </div>

              {/* Progress bar at bottom */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#CD7E31] to-[#E8DCCA] origin-left"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
