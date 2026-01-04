"use client";

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import backgroundLimited from '@assets/backgrounds/limited-bg.webp';

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
        defaultMuted={true}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810]/30 via-transparent to-[#2B1810]/60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-[#F5EFE6] tracking-tight font-ergon mb-4">
            Desert Rose Gin
          </h1>
          <p className="text-base md:text-lg text-[#CD7E31] uppercase tracking-[0.3em] font-medium">
            Saharan Spirit
          </p>
        </motion.div>

        {/* Explore Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={onEnterGallery}
          className="group relative px-8 py-4 bg-[#CD7E31] hover:bg-[#F5EFE6] text-[#2B1810] transition-all duration-300 overflow-hidden"
          data-cursor="button"
          data-cursor-text="Explore"
        >
          <span className="relative z-10 flex items-center gap-3 text-sm md:text-base font-medium uppercase tracking-[0.2em]">
            <Sparkles className="w-5 h-5" />
            Explore Our World
          </span>

          {/* Button shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <span className="text-xs md:text-sm font-medium tracking-widest text-white/70 uppercase">
            or scroll to discover
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}