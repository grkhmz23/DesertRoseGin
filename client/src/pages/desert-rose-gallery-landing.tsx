"use client";

import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigationManager } from '@/components/gallery/use-navigation-manager';
import { PageId } from '@/components/gallery/page-data';
import { HeroScene } from '@/components/media/scenes/hero-scene-updated';
import { PageCardGallery } from '@/components/gallery/page-card-gallery';
import { PageViewer } from '@/components/gallery/page-viewer';
import { AltimeterNavGallery } from '@/components/gallery/altimeter-nav-gallery';

import { Footer } from '@/components/layout/footer';
import { MobileControls } from '@/components/ui/mobile-controls';

// Import your existing scene components
import { StoryScene } from '@/components/media/scenes/story-scene';
import { ExperienceScene } from '@/components/media/scenes/experience-scene';
import { ProductScene } from '@/components/media/scenes/product-scene';
import { FullCocktailsScene } from '@/components/media/scenes/cocktails-scene';

// Import assets for product scenes
import bottleClassic from '@assets/bottles/2025-05-27_Desert_Rose_-_Mockup_Bottiglia_500ml_1765299128312.webp';
import bottleLimited from '@assets/bottles/bottle-limited.webp';
import logoImage from '@assets/logo.webp';
const classicGiftBox = '/assets/box/Gift box-500ml.png';
const limitedGiftBox = '/assets/box/Gift-box-500ml-limited-edition.png';
const sixBottleBox = '/assets/box/box_6_bottiglie_550x825.webp';
const bottleClassic200 = '/assets/bottles/bottle-200.webp';

// Product data
const classicData = {
  id: 'classic',
  name: "Desert Rose Classic Edition",
  batch: "042",
  abv: "43%",
  description: "Handcrafted with premium organic botanicals such as desert dates and saffron. Our Saharan-inspired gin is light and smooth on the palate with a distinct finish of spices.",
  shopifyHandle: 'desert-rose-gin-classic-edition-500ml',
  options: [
    {
      size: "500ml Bottle",
      price: "52 CHF (IVA incl.)",
      image: bottleClassic,
      shopifyLookupSize: "50cl Bottle",
      boxOption: {
        label: "6x 500ml Box",
        price: "312 CHF (IVA incl.)",
        image: sixBottleBox,
        shopifyLookupSize: "Box of 6 x 50cl",
        note: "Dimensions: 278 x 212 x 190 cm (L x W x H) • Capacity: 6 Bottles per Box",
      },
    },
    { size: "200ml Bottle", price: "37 CHF (IVA incl.)", image: bottleClassic200 },
    { size: "500ml Gift Box", price: "62 CHF (IVA incl.)", image: classicGiftBox, note: "Single 500ml bottle in gift packaging." },
  ]
};

const limitedData = {
  id: 'limited',
  name: "Desert Rose Limited Edition",
  batch: "001",
  abv: "43%",
  description: "Organic high-quality distillate created from a fusion of Saharan and Asian botanicals. The delicate, floral taste of Darjeeling tea combines with the sweetness of date fruit, creating a complex aroma, soft on the nose and refreshing on the palate.",
  shopifyHandle: 'desert-rose-gin-limited-edition-500ml',
  options: [
    {
      size: "500ml Bottle",
      price: "62 CHF (IVA incl.)",
      image: bottleLimited,
      shopifyLookupSize: "50cl Bottle",
      boxOption: {
        label: "6x 500ml Box",
        price: "372 CHF (IVA incl.)",
        image: sixBottleBox,
        shopifyLookupSize: "Box of 6 x 50cl",
        note: "Dimensions: 278 x 212 x 190 cm (L x W x H) • Capacity: 6 Bottles per Box",
      },
    },
    { size: "500ml Gift Box", price: "72 CHF (IVA incl.)", image: limitedGiftBox, note: "Single 500ml bottle in gift packaging." },
  ]
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

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2B1810] text-[#F5EFE6] overflow-hidden">

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

      {/* Footer - ONLY show in Gallery view (Desktop only - hidden on mobile via CSS) */}
      {navState.viewMode === 'gallery' && (
        <footer className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
          <div className="pointer-events-auto">
            <Footer />
          </div>
        </footer>
      )}

      {/* Mobile Controls - Language & Contact buttons (Mobile only) */}
      {navState.viewMode === 'gallery' && <MobileControls />}

    </div>
  );
}
