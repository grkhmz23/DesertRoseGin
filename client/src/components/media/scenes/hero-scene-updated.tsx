"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useWorldPolicy } from '@/experience/world/WorldProvider';

const backgroundLimited = '/backgrounds/limited-bg.webp';
const backgroundLimitedMobile = '/backgrounds/limited-bg-mobile.webp';

interface HeroSceneProps {
  isActive: boolean;
  isGalleryVisible: boolean;
  onRevealGallery: () => void;
}

export function HeroScene({ isActive, isGalleryVisible, onRevealGallery }: HeroSceneProps) {
  const { t } = useTranslation('common');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [hasLoadedMetadata, setHasLoadedMetadata] = useState(false);
  const { mode, reducedMotion } = useWorldPolicy();
  const cinematic = mode === "cinematic" && !reducedMotion;
  const heroPoster = isSmallViewport ? backgroundLimitedMobile : backgroundLimited;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
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
    if (isActive && videoRef.current) {
      const video = videoRef.current;
      if (isGalleryVisible) {
        if (hasLoadedMetadata && Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = Math.max(0, video.duration - 0.05);
        }
        video.pause();
        return;
      }

      // iOS Safari requires an explicit load() before play() when preload="metadata"
      video.load();
      video.currentTime = 0;
      video.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [hasLoadedMetadata, isActive, isGalleryVisible]);

  // On mobile, stop video at 15 seconds to avoid on-screen text overflowing small viewports
  useEffect(() => {
    if (!isSmallViewport) return;
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 15) {
        video.pause();
        revealGallery();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmallViewport]);

  const revealGallery = () => {
    const video = videoRef.current;
    if (video && hasLoadedMetadata && Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.max(0, video.duration - 0.05);
      video.pause();
    }
    onRevealGallery();
  };

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
      {/* Video for all devices */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        src="/video/hero.mp4"
        poster={heroPoster}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={() => setHasLoadedMetadata(true)}
        onEnded={revealGallery}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810]/30 via-transparent to-[#2B1810]/60" />

      {!isGalleryVisible && (
        <motion.button
          type="button"
          className="absolute bottom-8 right-6 sm:right-8 md:bottom-10 md:right-10 z-20 border border-[#F5EFE6]/20 bg-[#2B1810]/60 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#F5EFE6]/80 backdrop-blur-sm transition-colors hover:border-[#CD7E31]/40 hover:text-[#CD7E31]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: cinematic ? 1.2 : 0.4 }}
          onClick={revealGallery}
        >
          {t('ui.hero.skip')}
        </motion.button>
      )}
    </motion.div>
  );
}
