import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorldPolicy } from "@/experience/world/WorldProvider";
import { useTranslation } from "react-i18next";
import logoImage from "@assets/logo.webp";

interface LoadingScreenProps {
  minimumDuration?: number;
  onComplete?: () => void;
}

/**
 * LoadingScreen
 * 
 * Premium branded loading experience with:
 * - Animated rose/brand icon
 * - Smooth progress bar
 * - Rotating atmospheric messages
 * - Minimum display time for brand impression
 */
export function LoadingScreen({ 
  minimumDuration = 2500,
  onComplete 
}: LoadingScreenProps) {
  const { t } = useTranslation('common');
  const { reducedMotion } = useWorldPolicy();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const translatedMessages = t('ui.loading.messages', { returnObjects: true });
  const loadingMessages = Array.isArray(translatedMessages) && translatedMessages.length > 0
    ? translatedMessages
    : ['Preparing the experience'];
  // Only disable animations if user prefers reduced motion, not for mobile/performance mode
  const lightweightMode = reducedMotion;

  // Progress animation
  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minimumDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setIsExiting(true);
        setTimeout(() => {
          setIsLoading(false);
          onComplete?.();
        }, 600);
      }
    }, 16);

    return () => clearInterval(progressInterval);
  }, [lightweightMode, minimumDuration, onComplete]);

  // Rotate messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 800);

    return () => clearInterval(messageInterval);
  }, [loadingMessages.length]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[11000] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810] via-[#3D2419] to-[#2B1810]" />

          {/* Ambient glow */}
          <motion.div
            className="absolute w-[min(600px,90vw)] h-[min(600px,90vw)] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(205, 126, 49, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Animated brand mark */}
            <motion.div
              className="relative mb-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-[-20px] rounded-full border border-[#CD7E31]/12"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle pulsing ring */}
              <motion.div
                className="absolute inset-[-10px] rounded-full border border-[#CD7E31]/18"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Inner circle with the same transparent logo used in the header */}
              <motion.div
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full border border-[#CD7E31]/30 flex items-center justify-center backdrop-blur-sm"
                style={{
                  background: "radial-gradient(circle, rgba(205, 126, 49, 0.1) 0%, transparent 70%)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(205, 126, 49, 0.2)",
                    "0 0 40px rgba(205, 126, 49, 0.4)",
                    "0 0 20px rgba(205, 126, 49, 0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Rose icon / Brand mark */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={logoImage}
                    alt="Desert Rose Gin"
                    className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain select-none"
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.h1
              className="font-ergon-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E8DCCA] tracking-wide mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Desert Rose Gin
            </motion.h1>

            <motion.p
              className="font-hud text-[10px] tracking-[0.4em] uppercase text-[#CD7E31]/70 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {t('ui.loading.subtitle')}
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-36 sm:w-48 md:w-64 lg:w-72 h-[2px] bg-[#E8DCCA]/10 rounded-full overflow-hidden mb-6"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#CD7E31] to-[#E8DCCA]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Rotating message */}
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  className="font-body text-sm text-[#E8DCCA]/50 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {loadingMessages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress percentage */}
            <motion.p
              className="font-hud text-[10px] tracking-[0.3em] text-[#CD7E31]/50 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {Math.round(progress)}%
            </motion.p>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#CD7E31]/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
