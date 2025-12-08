import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DesertWindTransitionProps {
  active: boolean;
}

export function DesertWindTransition({ active }: DesertWindTransitionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (active && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover mix-blend-screen"
            muted
            playsInline
          >
            <source
              src="/video/desert-wind-transition.webm"
              type="video/webm"
            />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
