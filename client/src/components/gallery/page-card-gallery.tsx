"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { PageCard, CARD_WIDTH, CARD_HEIGHT } from './page-card';
import { PAGES, PageId } from './page-data';

type AnimationPhase = "scatter" | "line" | "circle" | "arc";

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

const TOTAL_CARDS = PAGES.length;
const MAX_SCROLL = 2000;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryProps) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  // --- Virtual Scroll Logic (Photo Gallery Style) ---
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  // Gallery browsing progress (which card is active)
  const galleryProgress = useTransform(virtualScroll, [600, MAX_SCROLL], [0, TOTAL_CARDS - 1]);
  const smoothGalleryProgress = useSpring(galleryProgress, { stiffness: 50, damping: 25 });

  // --- Mouse Parallax (subtle) ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 30); // Reduced parallax intensity
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // --- Intro Sequence ---
  useEffect(() => {
    if (!isActive) return;

    const timer1 = setTimeout(() => setIntroPhase("line"), 600);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2200);
    const timer3 = setTimeout(() => setIntroPhase("arc"), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isActive]);

  // --- Random Scatter Positions ---
  const scatterPositions = useMemo(() => {
    return PAGES.map(() => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 900,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  // --- Render Loop ---
  const [morphValue, setMorphValue] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
    const unsubscribeGallery = smoothGalleryProgress.on("change", setActiveCardIndex);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubscribeMorph();
      unsubscribeGallery();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothGalleryProgress, smoothMouseX]);

  // --- Content Opacity ---
  const titleOpacity = useTransform(smoothMorph, [0, 0.3], [1, 0]);
  const subtitleOpacity = useTransform(smoothMorph, [0.7, 1], [0, 1]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 bg-[#F5EFE6] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Desert texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} 
      />

      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

        {/* Intro Title (Fades out) */}
        <motion.div 
          style={{ opacity: titleOpacity }}
          className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" 
                ? { opacity: 1, y: 0, filter: "blur(0px)" } 
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-light tracking-tight text-[#2B1810] font-ergon"
          >
            Explore Our World
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" 
                ? { opacity: 0.6 } 
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-xs font-medium tracking-[0.25em] text-[#CD7E31]"
          >
            SCROLL TO BROWSE
          </motion.p>
        </motion.div>

        {/* Active Content (Fades in when arc forms) */}
        <motion.div
          style={{ opacity: subtitleOpacity }}
          className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#2B1810] tracking-tight mb-3 font-ergon">
            Choose Your Journey
          </h2>
          <p className="text-sm md:text-base text-[#2B1810]/70 max-w-lg leading-relaxed">
            Select a page to explore the world of Desert Rose Gin
          </p>
        </motion.div>

        {/* Main Card Container */}
        <div className="relative flex items-center justify-center w-full h-full">
          {PAGES.map((page, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 85;
              const lineTotalWidth = TOTAL_CARDS * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else if (introPhase === "circle") {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDimension * 0.35, 320);

              const circleAngle = (i / TOTAL_CARDS) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;

              target = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
                scale: 1,
                opacity: 1,
              };
            } else {
              // Arc phase - FIXED POSITION (Photo Gallery Style)
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);

              // Circle Position
              const circleRadius = Math.min(minDimension * 0.35, 320);
              const circleAngle = (i / TOTAL_CARDS) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              // Arc Position - STAYS CENTERED, NO ROTATION ON SCROLL
              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.3 : 1.05);
              const arcApexY = containerSize.height * (isMobile ? 0.38 : 0.28);
              const arcCenterY = arcApexY + arcRadius;

              const spreadAngle = isMobile ? 95 : 125;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_CARDS - 1);

              // FIXED: No rotation, arc stays in place
              const currentArcAngle = startAngle + i * step;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              // Photo Gallery Effect: Scale and highlight based on active card
              const distanceFromActive = Math.abs(i - activeCardIndex);
              const isActive = distanceFromActive < 0.5; // Current card
              const isNearby = distanceFromActive < 1.5; // Adjacent cards

              // Scale effect: active card is bigger, others slightly smaller
              let photoGalleryScale = isMobile ? 1.4 : 1.7;
              if (isActive) {
                photoGalleryScale *= 1.15; // 15% bigger
              } else if (isNearby) {
                photoGalleryScale *= 1.05; // 5% bigger
              } else {
                photoGalleryScale *= 0.95; // 5% smaller
              }

              // Opacity effect: dim cards that are far from active
              let cardOpacity = 1;
              if (distanceFromActive > 2) {
                cardOpacity = 0.7;
              } else if (!isActive && !isNearby) {
                cardOpacity = 0.85;
              }

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: photoGalleryScale,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: lerp(1, cardOpacity, morphValue),
              };
            }

            return (
              <PageCard
                key={page.id}
                page={page}
                index={i}
                target={target}
                onClick={() => onPageSelect(page.id)}
              />
            );
          })}
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: introPhase === "arc" ? 0.6 : 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-xs text-[#2B1810]/60 uppercase tracking-widest">
            Scroll to browse • Click to explore
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}