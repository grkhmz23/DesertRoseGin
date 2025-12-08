import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DesertWindTransitionProps {
  active: boolean;
  durationMs?: number;
}

export function DesertWindTransition({
  active,
  durationMs = 1200,
}: DesertWindTransitionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    console.log('🌪️ DesertWindTransition active:', active);
    if (active && videoRef.current) {
      console.log('🎬 Playing transition video');
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.error('❌ Video play failed:', err);
      });
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
          data-testid="transition-overlay"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover mix-blend-screen"
            muted
            playsInline
            data-testid="transition-video"
          >
            <source
              src="/video/desert-wind-transition.webm"
              type="video/webm"
            />
            <source
              src="/video/desert-wind-transition.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
