import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/components/transition-context";

export const SlideTransition = React.forwardRef((props, ref) => {
  const { isTransitioning } = useTransition();
  const [isPresent, setIsPresent] = useState(false);

  // Sync internal state with context to handle exit animations
  useEffect(() => {
    if (isTransitioning) {
      setIsPresent(true);
    } else {
      // Small delay to allow exit animation to finish before unmounting logic if needed
      const timer = setTimeout(() => setIsPresent(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // The slideshow "Shutter" effect
  // 3 Columns that slide down/up to cover the screen
  const variants = {
    initial: { scaleY: 0, transformOrigin: "top" },
    animate: { scaleY: 1, transformOrigin: "top", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
    exit: { scaleY: 0, transformOrigin: "bottom", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }
  };

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] flex pointer-events-none">
          {/* Column 1: Dark Brown (Brand) */}
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-1/3 h-full bg-[#2B1810] border-r border-[#CD7E31]/10"
          />

          {/* Column 2: Slightly Lighter Brown */}
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: 0.1 }} // Staggered
            className="w-1/3 h-full bg-[#3a2218] border-r border-[#CD7E31]/10"
          />

          {/* Column 3: Accent / Dark Mix */}
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: 0.2 }} // Staggered
            className="w-1/3 h-full bg-[#2B1810]"
          >
            {/* Logo in the center column */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ delay: 0.3 }}
                 className="font-lux text-[#CD7E31] text-4xl md:text-6xl opacity-20 tracking-widest"
               >
                 DESERT ROSE
               </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

SlideTransition.displayName = "SlideTransition";