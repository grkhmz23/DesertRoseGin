"use client";

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
const backgroundLimited = '/backgrounds/limited-bg.webp';

interface HeroSceneProps {
  isActive: boolean;
  onEnterGallery: () => void;
}

export function HeroScene({ isActive, onEnterGallery }: HeroSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollThreshold = 200; // Pixels to scroll before triggering gallery

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [isActive]);

  // Scroll detection to auto-enter gallery
  useEffect(() => {
    if (!isActive) return;

    let accumulatedScroll = 0;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) { // Scrolling down
        accumulatedScroll += e.deltaY;
        if (accumulatedScroll > scrollThreshold) {
          onEnterGallery();
        }
      } else {
        accumulatedScroll = Math.max(0, accumulatedScroll + e.deltaY);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (deltaY > 0) { // Swiping up
        accumulatedScroll += deltaY;
        if (accumulatedScroll > scrollThreshold) {
          onEnterGallery();
        }
      }

      touchStartY = touchY;
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isActive, onEnterGallery]);

  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#2B1810] scene-locked"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      data-testid="scene-hero"
      data-scene-type="locked"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        src="/video/hero.mp4"
        poster={backgroundLimited}
        autoPlay
        loop
        muted
        playsInline={true}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810]/30 via-transparent to-[#2B1810]/60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">

      </div>

      {/* Scroll Indicator - Bottom Left */}
      <motion.div
        className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex flex-col items-start gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span className="text-xs md:text-sm font-medium tracking-widest text-white/70 uppercase">
          Scroll to discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}