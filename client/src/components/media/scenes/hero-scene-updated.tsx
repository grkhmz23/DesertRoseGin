"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SmartVideo } from '@/components/media/smart-video';
import { useWorldPolicy } from '@/experience/world/WorldProvider';
import introLogo from '../../../../../second-logo-transparent.png';

const backgroundLimited = '/backgrounds/limited-bg.webp';
const backgroundLimitedMobile = '/backgrounds/limited-bg-mobile.webp';

interface HeroSceneProps {
  isActive: boolean;
  onEnterGallery: () => void;
}

export function HeroScene({ isActive, onEnterGallery }: HeroSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [showCenterLogo, setShowCenterLogo] = useState(true);
  const scrollThreshold = 200; // Pixels to scroll before triggering gallery
  const { mode, reducedMotion } = useWorldPolicy();
  const cinematic = mode === "cinematic" && !reducedMotion;
  const heroPoster = isSmallViewport ? backgroundLimitedMobile : backgroundLimited;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const syncViewport = () => setIsSmallViewport(mediaQuery.matches);
    syncViewport();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener('change', syncViewport);
      return () => mediaQuery.removeEventListener('change', syncViewport);
    }
    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  useEffect(() => {
    if (isActive && cinematic && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [cinematic, isActive]);

  useEffect(() => {
    setShowCenterLogo(true);
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!isActive || !cinematic || !video) return;

    const syncLogoVisibility = () => {
      setShowCenterLogo(video.currentTime < 2.6);
    };

    syncLogoVisibility();
    video.addEventListener('loadedmetadata', syncLogoVisibility);
    video.addEventListener('timeupdate', syncLogoVisibility);

    return () => {
      video.removeEventListener('loadedmetadata', syncLogoVisibility);
      video.removeEventListener('timeupdate', syncLogoVisibility);
    };
  }, [cinematic, isActive]);

  // Scroll detection to auto-enter gallery
  useEffect(() => {
    if (!isActive) return;

    let accumulatedScroll = 0;
    const touchStepThreshold = 8;

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
    let isTouchTracking = false;
    const handleTouchStart = (e: TouchEvent) => {
      isTouchTracking = true;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchTracking) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (Math.abs(deltaY) < touchStepThreshold) {
        return;
      }

      if (deltaY > 0) { // Swiping up
        accumulatedScroll += deltaY;
        if (accumulatedScroll > scrollThreshold) {
          onEnterGallery();
        }
      } else {
        accumulatedScroll = Math.max(0, accumulatedScroll + deltaY);
      }

      touchStartY = touchY;
    };

    const handleTouchEnd = () => {
      isTouchTracking = false;
      accumulatedScroll = 0;
    };

    const passive = { passive: true } as const;

    window.addEventListener('wheel', handleWheel, passive);
    window.addEventListener('touchstart', handleTouchStart, passive);
    window.addEventListener('touchmove', handleTouchMove, passive);
    window.addEventListener('touchend', handleTouchEnd, passive);
    window.addEventListener('touchcancel', handleTouchEnd, passive);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
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
      {/* Mobile/performance mode avoids eager autoplay/decode for smoother first render */}
      {cinematic ? (
        <SmartVideo
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
          src="/video/hero.mp4"
          poster={heroPoster}
          policy="always"
          preload="metadata"
        />
      ) : (
        <picture className="absolute inset-0 block w-full h-full z-0">
          <source media="(max-width: 768px)" srcSet={backgroundLimitedMobile} />
          <img
            src={backgroundLimited}
            alt=""
            className="w-full h-full object-cover opacity-60"
            draggable={false}
          />
        </picture>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810]/30 via-transparent to-[#2B1810]/60" />

      {/* Center Logo Intro */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{
            opacity: showCenterLogo ? 1 : 0,
            scale: showCenterLogo ? 1 : 1.03,
            y: showCenterLogo ? 0 : -6,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute h-[18rem] w-[18rem] md:h-[24rem] md:w-[24rem] rounded-full bg-[#f2dfb0]/18 blur-[72px]" />
          <img
            src={introLogo}
            alt="Desert Rose Gin"
            className="relative w-[18rem] md:w-[24rem] lg:w-[29rem] h-auto object-contain drop-shadow-[0_0_28px_rgba(242,223,176,0.2)]"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator - Bottom Left */}
      <motion.div
        className="absolute bottom-3 left-24 md:bottom-5 md:left-16 flex flex-col items-start gap-2"
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
