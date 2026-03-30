"use client";

import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useNavigationManager } from '@/components/gallery/use-navigation-manager';
import { PageId, getPageIdFromPath, getPageRoute } from '@/components/gallery/page-data';
import { HeroScene } from '@/components/media/scenes/hero-scene-updated';
import { PageCardGallery } from '@/components/gallery/page-card-gallery';
import { PageViewer } from '@/components/gallery/page-viewer';
import { AltimeterNavGallery } from '@/components/gallery/altimeter-nav-gallery';

import { Footer } from '@/components/layout/footer';
import { MobileControls } from '@/components/ui/mobile-controls';

const StoryScene = lazy(() =>
  import('@/components/media/scenes/story-scene').then((module) => ({ default: module.StoryScene }))
);
const ExperienceScene = lazy(() =>
  import('@/components/media/scenes/experience-scene').then((module) => ({ default: module.ExperienceScene }))
);
const ProductScene = lazy(() =>
  import('@/components/media/scenes/product-scene').then((module) => ({ default: module.ProductScene }))
);
const FullCocktailsScene = lazy(() =>
  import('@/components/media/scenes/cocktails-scene').then((module) => ({ default: module.FullCocktailsScene }))
);

// Import normalized assets for product scenes
import bottleClassic from '@assets/products/classic-500-normalized.webp';
import bottleLimited from '@assets/products/limited-500-normalized.webp';
import bottleClassic200 from '@assets/products/classic-200-normalized.webp';
import classicGiftBox from '@assets/products/classic-gift-normalized.webp';
import limitedGiftBox from '@assets/products/limited-gift-normalized.webp';
import sixBottleBox from '@assets/products/box-6x500-normalized.webp';
import logoImage from '@assets/logo.webp';

export function DesertRoseGalleryLanding() {
  const { t } = useTranslation('common');
  const {
    navState,
    openPage,
    returnToGallery,
  } = useNavigationManager();
  const [location, setLocation] = useLocation();
  const [isHeroGalleryVisible, setIsHeroGalleryVisible] = useState(false);

  // Scroll position tracking for scenes that need it
  const [sceneScrollPositions, setSceneScrollPositions] = useState<Record<number, any>>({});
  const vatSuffix = ' CHF (IVA incl.)';
  const boxNote = t('ui.product.options.boxNote');
  const giftNote = t('ui.product.options.giftNote');
  const classicData = {
    id: 'classic',
    name: "Desert Rose Gin Classic Edition",
    batch: "042",
    abv: "43%",
    description: "Handcrafted with premium organic botanicals such as desert dates and saffron. Our Saharan-inspired gin is light and smooth on the palate with a distinct finish of spices.",
    shopifyHandle: 'desert-rose-gin-classic-edition-500ml',
    options: [
      {
        size: t('ui.product.options.bottle500'),
        price: `52${vatSuffix}`,
        image: bottleClassic,
        shopifyLookupSize: "50cl Bottle",
        boxOption: {
          label: t('ui.product.options.box6x500'),
          price: `312${vatSuffix}`,
          image: sixBottleBox,
          shopifyLookupSize: "Box of 6 x 50cl",
          note: boxNote,
        },
      },
      { size: t('ui.product.options.bottle200'), price: `37${vatSuffix}`, image: bottleClassic200 },
      { size: t('ui.product.options.gift500'), price: `62${vatSuffix}`, image: classicGiftBox, note: giftNote },
    ]
  };
  const limitedData = {
    id: 'limited',
    name: "Desert Rose Gin Limited Edition",
    batch: "001",
    abv: "43%",
    description: "Organic high-quality distillate created from a fusion of Saharan and Asian botanicals. The delicate, floral taste of Darjeeling tea combines with the sweetness of date fruit, creating a complex aroma, soft on the nose and refreshing on the palate.",
    shopifyHandle: 'desert-rose-gin-limited-edition-500ml',
    options: [
      {
        size: t('ui.product.options.bottle500'),
        price: `62${vatSuffix}`,
        image: bottleLimited,
        shopifyLookupSize: "50cl Bottle",
        boxOption: {
          label: t('ui.product.options.box6x500'),
          price: `372${vatSuffix}`,
          image: sixBottleBox,
          shopifyLookupSize: "Box of 6 x 50cl",
          note: boxNote,
        },
      },
      { size: t('ui.product.options.gift500'), price: `72${vatSuffix}`, image: limitedGiftBox, note: giftNote },
    ]
  };

  const pageLoadingFallback = (
    <div className="absolute inset-0 bg-[#2B1810] flex items-center justify-center">
      <div className="text-[10px] uppercase tracking-[0.35em] text-[#F5EFE6]/55">
        {t('ui.loading.messages.0')}
      </div>
    </div>
  );

  const handleSceneScrollPosition = useCallback((sceneIndex: number) => {
    return (position: any) => {
      setSceneScrollPositions(prev => ({
        ...prev,
        [sceneIndex]: position,
      }));
    };
  }, []);

  useEffect(() => {
    const pageFromPath = getPageIdFromPath(location);

    if (pageFromPath) {
      setIsHeroGalleryVisible(true);

      if (navState.viewMode !== 'page' || navState.selectedPage !== pageFromPath) {
        openPage(pageFromPath);
      }
      return;
    }

    if (navState.viewMode === 'page') {
      returnToGallery();
      setIsHeroGalleryVisible(true);
    }
  }, [location, navState.selectedPage, navState.viewMode, openPage, returnToGallery]);

  const handleOpenPage = useCallback((pageId: PageId) => {
    const nextPath = getPageRoute(pageId);

    if (location !== nextPath) {
      setLocation(nextPath);
    }

    openPage(pageId);
  }, [location, openPage, setLocation]);

  const handleReturnToGallery = useCallback(() => {
    if (location !== "/") {
      setLocation("/");
    }

    setIsHeroGalleryVisible(true);
    returnToGallery();
  }, [location, returnToGallery, setLocation]);

  // Render the appropriate scene component based on selected page
  const renderPageContent = () => {
    if (!navState.selectedPage) return null;

    switch (navState.selectedPage) {
      case 'story':
        return (
          <Suspense fallback={pageLoadingFallback}>
            <StoryScene
              isActive={true}
              onScrollPositionChange={handleSceneScrollPosition(1)}
            />
          </Suspense>
        );

      case 'experience':
        return (
          <Suspense fallback={pageLoadingFallback}>
            <ExperienceScene
              isActive={true}
              onScrollPositionChange={handleSceneScrollPosition(2)}
            />
          </Suspense>
        );

      case 'classic':
        return (
          <Suspense fallback={pageLoadingFallback}>
            <ProductScene
              data={classicData}
              isActive={true}
              direction={1}
            />
          </Suspense>
        );

      case 'limited':
        return (
          <Suspense fallback={pageLoadingFallback}>
            <ProductScene
              data={limitedData}
              isActive={true}
              direction={1}
            />
          </Suspense>
        );

      case 'cocktails':
        return (
          <Suspense fallback={pageLoadingFallback}>
            <FullCocktailsScene
              isActive={true}
              onDragStateChange={() => {}}
              onScrollPositionChange={handleSceneScrollPosition(5)}
            />
          </Suspense>
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
        onSelectPage={handleOpenPage}
      />

      {/* Logo - hidden during hero intro video */}
      {(navState.viewMode === 'page' || isHeroGalleryVisible) && (
        <header className="fixed top-0 left-0 p-4 md:p-6 lg:p-8 z-[70]">
          <img
            src={logoImage}
            alt="Desert Rose Gin Logo"
            className="h-12 sm:h-14 md:h-20 lg:h-24 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer"
            draggable={false}
            onClick={() => {
              if (navState.viewMode === 'page') {
                handleReturnToGallery();
              }
            }}
          />
        </header>
      )}

      {/* Main Content - View Mode Switching */}
      <main className="relative w-full h-full">
        <AnimatePresence mode="wait">

          {/* Hero View */}
          {navState.viewMode === 'hero' && (
            <>
              <HeroScene
                key="hero"
                isActive={true}
                isGalleryVisible={isHeroGalleryVisible}
                onRevealGallery={() => setIsHeroGalleryVisible(true)}
              />
              {isHeroGalleryVisible && (
                <PageCardGallery
                  key="hero-gallery"
                  isActive={true}
                  embeddedOnHero={true}
                  initialPageId={navState.lastGalleryPage}
                  onPageSelect={handleOpenPage}
                />
              )}
            </>
          )}

          {/* Full Page View */}
          {navState.viewMode === 'page' && navState.selectedPage && (
            <PageViewer
              key={`page-${navState.selectedPage}`}
              pageId={navState.selectedPage}
              isActive={true}
              onClose={handleReturnToGallery}
            >
              {renderPageContent()}
            </PageViewer>
          )}

        </AnimatePresence>
      </main>

      {/* Footer - show when cards are visible on the hero layer */}
      {navState.viewMode === 'hero' && isHeroGalleryVisible && (
        <footer className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
          <div className="pointer-events-auto">
            <Footer />
          </div>
        </footer>
      )}

      {/* Mobile Controls - Language & Contact buttons (Mobile only) */}
      {navState.viewMode === 'hero' && isHeroGalleryVisible && <MobileControls />}

    </div>
  );
}
