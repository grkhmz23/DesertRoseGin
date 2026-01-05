"use client";

import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigationManager } from '@/components/gallery/use-navigation-manager';
import { PageId } from '@/components/gallery/page-data';
import { HeroScene } from '@/components/scenes/hero-scene-updated';
import { PageCardGallery } from '@/components/gallery/page-card-gallery';
import { PageViewer } from '@/components/gallery/page-viewer';
import { AltimeterNavGallery } from '@/components/gallery/altimeter-nav-gallery';
import { EventsComingSoonScene } from '@/components/scenes/events-coming-soon-scene';
import { Footer } from '@/components/layout/footer';

// Import your existing scene components
// These will be passed to PageViewer based on selected page
import { StoryScene } from '@/components/scenes/story-scene';
import { ExperienceScene } from '@/components/scenes/experience-scene';
import { ProductScene } from '@/components/scenes/product-scene';
import { FullCocktailsScene } from '@/components/scenes/cocktails-scene';

// Import assets for product scenes
import bottleClassic from '@assets/bottles/2025-05-27_Desert_Rose_-_Mockup_Bottiglia_500ml_1765299128312.webp';
import bottleLimited from '@assets/bottles/bottle-limited.webp';
import logoImage from '@assets/logo.webp';

// Product data
const classicData = {
  id: 'classic',
  name: "DESERT ROSE CLASSIC EDITION",
  year: "2024",
  batch: "042",
  abv: "43%",
  description: "Small batch handcrafted gin, bottled and handcrafted in Switzerland. Saharan desert inspired with notes of sun-baked citrus, sage, and hidden floral sweetness.",
  botanicals: ["Wild Sage", "Saffron", "Juniper", "Rose Hip"],
  bottleImage: bottleClassic,
};

const limitedData = {
  id: 'limited',
  name: "DESERT ROSE LIMITED EDITION",
  year: "2025",
  batch: "001",
  abv: "43%",
  description: "London Dry Gin, bottled and handcrafted in Switzerland. Saharan desert inspired with Date, Darjeeling tea, Lemon & Orange for an intense, warm finish.",
  botanicals: ["Date", "Darjeeling Tea", "Lemon", "Orange"],
  bottleImage: bottleLimited,
};

export function DesertRoseGalleryLanding() {
  const {
    navState,
    enterGallery,
    openPage,
    returnToGallery,
    isTransitioning,
  } = useNavigationManager();

  // Scroll position tracking for scenes that need it
  const [sceneScrollPositions, setSceneScrollPositions] = useState<Record<number, any>>({});

  const handleSceneScrollPosition = useCallback((sceneIndex: number) => {
    return (position: any) => {
      setSceneScrollPositions(prev => ({
        ...prev,
        [sceneIndex]: position,
      }));
    };
  }, []);

  // Render the appropriate scene component based on selected page
  const renderPageContent = () => {
    if (!navState.selectedPage) return null;

    switch (navState.selectedPage) {
      case 'story':
        return (
          <StoryScene 
            isActive={true} 
            onScrollPositionChange={handleSceneScrollPosition(1)} 
          />
        );

      case 'experience':
        return (
          <ExperienceScene 
            isActive={true} 
            onScrollPositionChange={handleSceneScrollPosition(2)} 
          />
        );

      case 'classic':
        return (
          <ProductScene 
            data={classicData} 
            isActive={true} 
            direction={1} 
          />
        );

      case 'limited':
        return (
          <ProductScene 
            data={limitedData} 
            isActive={true} 
            direction={1} 
          />
        );

      case 'cocktails':
        return (
          <FullCocktailsScene 
            isActive={true} 
            onDragStateChange={() => {}}
            onScrollPositionChange={handleSceneScrollPosition(5)}
          />
        );

      case 'events':
        return <EventsComingSoonScene />;

      default:
        return null;
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-[#2B1810] text-[#F5EFE6] overflow-hidden">

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation Indicator */}
      <AltimeterNavGallery
        viewMode={navState.viewMode}
        selectedPage={navState.selectedPage}
        onReturnToGallery={returnToGallery}
      />

      {/* Logo (always visible) */}
      <header className="fixed top-0 left-0 p-4 md:p-8 z-[70]">
        <img 
          src={logoImage}
          alt="Desert Rose Gin Logo" 
          className="h-16 md:h-24 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer" 
          draggable={false}
          onClick={() => {
            // Optional: click logo to return to hero or gallery
            if (navState.viewMode === 'page') {
              returnToGallery();
            }
          }}
        />
      </header>

      {/* Main Content - View Mode Switching */}
      <main className="relative w-full h-full">
        <AnimatePresence mode="wait">

          {/* Hero View */}
          {navState.viewMode === 'hero' && (
            <HeroScene
              key="hero"
              isActive={true}
              onEnterGallery={enterGallery}
            />
          )}

          {/* Gallery View */}
          {navState.viewMode === 'gallery' && (
            <PageCardGallery
              key="gallery"
              isActive={true}
              onPageSelect={(pageId: PageId) => openPage(pageId)}
            />
          )}

          {/* Full Page View */}
          {navState.viewMode === 'page' && navState.selectedPage && (
            <PageViewer
              key={`page-${navState.selectedPage}`}
              pageId={navState.selectedPage}
              isActive={true}
              onClose={returnToGallery}
            >
              {renderPageContent()}
            </PageViewer>
          )}

        </AnimatePresence>
      </main>

      {/* Footer - Only show in Gallery and Page views, NOT in Hero */}
      {navState.viewMode !== 'hero' && (
        <footer className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
          <div className="pointer-events-auto">
            <Footer />
          </div>
        </footer>
      )}

    </div>
  );
}