"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { PageCard } from './page-card';
import { PAGES, PageId } from './page-data';

type AnimationPhase = "scatter" | "line" | "circle" | "horizontal";

interface PageCardGalleryProps {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

const TOTAL_CARDS = PAGES.length;

export function PageCardGallery({ onPageSelect, isActive }: PageCardGalleryProps) {
  const { t } = useTranslation('common');
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intro Animation Sequence (2 seconds total)
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
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 400,
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
      className="absolute inset-0 z-40 overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 bg-[#2B1810]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          poster="/video/gallery-bg-poster.webp"
        >
          <source src="/video/gallery-bg.webm" type="video/webm" />
          <source src="/video/gallery-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#2B1810]/60" />
      </div>

      {/* Content Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-full flex items-center justify-center"
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
        <div className="absolute top-[35%] left-0 right-0 flex items-center justify-center">
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
              const circleRadius = 280;
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
              const spacing = 200;
              const totalWidth = (TOTAL_CARDS - 1) * spacing;
              const horizontalX = (i * spacing) - (totalWidth / 2);
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
