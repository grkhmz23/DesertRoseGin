"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { CardStack, CardStackItem } from '@/components/ui/card-stack';
import { getPages, PageId } from './page-data';
import { Clock } from 'lucide-react';

interface PageCardGalleryV2Props {
  onPageSelect: (pageId: PageId) => void;
  isActive: boolean;
}

export function PageCardGalleryV2({ onPageSelect, isActive }: PageCardGalleryV2Props) {
  const { t } = useTranslation('common');

  const PAGES = getPages();

  // Convert pages to CardStackItem format
  const cardItems: (CardStackItem & { pageId: PageId })[] = PAGES.map(page => ({
    id: page.id,
    pageId: page.id,
    title: page.title,
    subtitle: page.subtitle,
    description: page.description,
    imageSrc: page.thumbnail,
    category: page.category,
    color: page.color,
    comingSoon: page.comingSoon,
  }));

  const handleCardClick = (item: CardStackItem & { pageId: PageId }) => {
    onPageSelect(item.pageId);
  };

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

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header spacer */}
        <div className="h-16 md:h-20 flex-shrink-0" />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center px-4 py-4 md:py-6"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-[#F5EFE6] tracking-tight mb-2 md:mb-3 font-ergon">
            {t('gallery.title')}
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-[#F5EFE6]/70 max-w-lg mx-auto">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Card Stack - Desktop */}
        <div className="hidden md:flex flex-1 items-center justify-center px-4">
          <CardStack
            items={cardItems}
            initialIndex={2}
            maxVisible={5}
            cardWidth={280}
            cardHeight={400}
            overlap={0.45}
            spreadDeg={32}
            perspectivePx={1200}
            depthPx={100}
            tiltXDeg={6}
            activeLiftPx={35}
            activeScale={1.08}
            inactiveScale={0.88}
            springStiffness={250}
            springDamping={28}
            loop={true}
            autoAdvance={false}
            showDots={true}
            onCardClick={handleCardClick}
            className="max-w-5xl"
          />
        </div>

        {/* Card Stack - Mobile (smaller cards) */}
        <div className="md:hidden flex-1 flex items-center justify-center px-2 pb-16">
          <CardStack
            items={cardItems}
            initialIndex={2}
            maxVisible={5}
            cardWidth={200}
            cardHeight={280}
            overlap={0.5}
            spreadDeg={35}
            perspectivePx={800}
            depthPx={60}
            tiltXDeg={8}
            activeLiftPx={25}
            activeScale={1.06}
            inactiveScale={0.85}
            springStiffness={280}
            springDamping={26}
            loop={true}
            autoAdvance={false}
            showDots={true}
            onCardClick={handleCardClick}
          />
        </div>

        {/* Hint Text - Desktop */}
        <div className="hidden md:block pb-6 text-center">
          <p className="text-xs text-[#F5EFE6]/50 uppercase tracking-widest">
            {t('gallery.hint')} · Swipe or drag to browse
          </p>
        </div>
      </div>
    </motion.div>
  );
}