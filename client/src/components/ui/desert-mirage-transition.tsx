import { useImperativeHandle, forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DesertMirageTransitionRef {
  startTransition: (onMidpoint: () => void, onComplete?: () => void) => void;
}

interface TransitionState {
  isActive: boolean;
  phase: "idle" | "enter" | "peak" | "exit";
}

/**
 * Desert Mirage Transition
 * 
 * A warm, elegant transition inspired by desert heat shimmer.
 * Features:
 * - Diagonal golden gradient sweep
 * - Subtle heat distortion effect
 * - Quick 800ms total duration
 * - Luxury feel appropriate for premium spirits
 */
export const DesertMirageTransition = forwardRef<DesertMirageTransitionRef>(
  (_, ref) => {
    const [state, setState] = useState<TransitionState>({
      isActive: false,
      phase: "idle",
    });

    const [callbacks, setCallbacks] = useState<{
      onMidpoint: (() => void) | null;
      onComplete: (() => void) | null;
    }>({
      onMidpoint: null,
      onComplete: null,
    });

    useImperativeHandle(ref, () => ({
      startTransition(onMidpoint: () => void, onComplete?: () => void) {
        if (state.isActive) return;

        setCallbacks({
          onMidpoint,
          onComplete: onComplete ?? null,
        });

        setState({ isActive: true, phase: "enter" });

        // Phase timing
        setTimeout(() => {
          setState(prev => ({ ...prev, phase: "peak" }));
          onMidpoint();
        }, 400);

        setTimeout(() => {
          setState(prev => ({ ...prev, phase: "exit" }));
        }, 500);

        setTimeout(() => {
          setState({ isActive: false, phase: "idle" });
          if (onComplete) onComplete();
        }, 900);
      },
    }));

    return (
      <AnimatePresence>
        {state.isActive && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Base warm gradient layer */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #2B1810 0%, #4E3022 30%, #8B5A2B 50%, #CD7E31 70%, #E8DCCA 100%)",
              }}
              initial={{ 
                clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                opacity: 0.95,
              }}
              animate={{
                clipPath: state.phase === "exit" 
                  ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
                  : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                opacity: state.phase === "exit" ? 0 : 0.95,
              }}
              transition={{
                clipPath: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
                opacity: { duration: 0.3 },
              }}
            />

            {/* Heat shimmer overlay */}
            <motion.div
              className="absolute inset-0 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.15,
              }}
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.02, 1],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />

            {/* Diagonal light sweep */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)",
                backgroundSize: "200% 200%",
              }}
              initial={{ backgroundPosition: "-100% -100%" }}
              animate={{ backgroundPosition: "200% 200%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Golden particles */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: state.phase === "peak" ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `rgba(${205 + Math.random() * 50}, ${126 + Math.random() * 50}, ${49 + Math.random() * 30}, ${0.4 + Math.random() * 0.4})`,
                    filter: "blur(1px)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    y: -50,
                    x: (Math.random() - 0.5) * 100,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>

            {/* Center brand mark flash */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: state.phase === "peak" ? 1 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full border border-[#E8DCCA]/40 flex items-center justify-center backdrop-blur-sm"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: state.phase === "peak" ? 1 : 0.8,
                  opacity: state.phase === "peak" ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="font-lux text-xl tracking-[0.3em] text-[#E8DCCA]">
                  DR
                </span>
              </motion.div>
            </motion.div>

            {/* Vignette edges */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, transparent 0%, rgba(43, 24, 16, 0.4) 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

DesertMirageTransition.displayName = "DesertMirageTransition";
