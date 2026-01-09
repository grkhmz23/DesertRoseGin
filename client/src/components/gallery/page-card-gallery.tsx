"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { PageCard, CARD_WIDTH } from './page-card';
import { getPages, PageId } from './page-data';
import { Clock } from 'lucide-react';

type AnimationPhase = "scatter" | "line" | "circle" | "horizontal";

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryProps) {
  const { t } = useTranslation('common');

  const PAGES = getPages();
  const TOTAL_CARDS = PAGES.length;

  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop Animation Sequence
  useEffect(() => {
    if (!isActive) return;

    const sequence = [
      { phase: "scatter" as AnimationPhase, delay: 0 },
      { phase: "line" as AnimationPhase, delay: 400 },
      { phase: "circle" as AnimationPhase, delay: 800 },
      { phase: "horizontal" as AnimationPhase, delay: 1400 },
    ];

    sequence.forEach(({ phase, delay }) => {
      setTimeout(() => setIntroPhase(phase), delay);
    });

    setTimeout(() => setAnimationComplete(true), 2000);
  }, [isActive]);

  const scatterPositions = PAGES.map(() => ({
    x: (Math.random() - 0.5) * 800,
    y: (Math.random() - 0.5) * 500,
    rotation: Math.random() * 360,
    scale: 1,
    opacity: 1,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-40"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#2B1810]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 md:opacity-50"
          poster="/video/gallery-bg-poster.webp"
        >
          <source src="/video/gallery-bg.webm" type="video/webm" />
          <source src="/video/gallery-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#2B1810]/50 md:bg-[#2B1810]/60" />
      </div>

      {/* ===================== MOBILE LAYOUT ===================== */}
      <div className="md:hidden absolute inset-0 flex flex-col">
        {/* Header spacer for logo */}
        <div className="h-20 flex-shrink-0" />

        {/* Title */}
        <div className="px-4 py-3 text-center flex-shrink-0">
          <h2 className="text-xl font-light text-[#F5EFE6] tracking-tight mb-1 font-ergon">
            {t('gallery.title')}
          </h2>
          <p className="text-[10px] text-[#F5EFE6]/60">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Scrollable Cards Grid */}
        <div className="flex-1 overflow-y-auto px-3 pb-16">
          <div className="grid grid-cols-2 gap-2.5">
            {PAGES.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => onPageSelect(page.id)}
                className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg active:scale-[0.98] transition-transform bg-[#1a0f0a]"
              >
                {/* Image */}
                <img
                  src={page.thumbnail}
                  alt={page.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1810] via-[#2B1810]/30 to-transparent" />

                {/* Coming Soon Badge */}
                {page.comingSoon && (
                  <div className="absolute top-1.5 right-1.5 bg-[#CD7E31] text-[#2B1810] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider flex items-center gap-0.5 rounded-sm">
                    <Clock className="w-2 h-2" />
                    Soon
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p 
                    className="text-[7px] font-bold uppercase tracking-widest mb-0.5"
                    style={{ color: page.color }}
                  >
                    {page.category}
                  </p>
                  <h3 className="text-[10px] font-bold text-[#F5EFE6] leading-tight line-clamp-2">
                    {page.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== DESKTOP LAYOUT ===================== */}
      <div
        ref={containerRef}
        className="hidden md:flex absolute inset-0 items-center justify-center"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : -20 }}
          transition={{ duration: 0.6 }}
          className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <h2 className="text-3xl md:text-5xl font-light text-[#F5EFE6] tracking-tight mb-3 font-ergon">
            {t('gallery.title')}
          </h2>
          <p className="text-sm md:text-base text-[#F5EFE6]/80 max-w-lg leading-relaxed">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="absolute top-[40%] left-1/2 w-0 h-0">
          {PAGES.map((page, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 115;
              const lineTotalWidth = TOTAL_CARDS * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2 - (CARD_WIDTH / 2);
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else if (introPhase === "circle") {
              const circleRadius = 360;
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
              const spacing = 225;
              const totalWidth = (TOTAL_CARDS - 1) * spacing;
              const horizontalX = (i * spacing) - (totalWidth / 2) - (CARD_WIDTH / 2);
              const isHovered = hoveredIndex === i;
              const scale = isHovered ? 1.15 : 1;

              target = {
                x: horizontalX,
                y: 0,
                rotation: 0,
                scale: scale,
                opacity: 1,
              };
            }

            return (
              <div
                key={page.id}
                className="absolute"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <PageCard
                  page={page}
                  index={i}
                  target={target}
                  onClick={() => onPageSelect(page.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Hint Text */}
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-xs text-[#F5EFE6]/70 uppercase tracking-widest">
              {t('gallery.hint')}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}