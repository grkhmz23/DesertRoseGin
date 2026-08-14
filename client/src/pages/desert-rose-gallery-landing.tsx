"use client";

import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useNavigationManager } from '@/components/gallery/use-navigation-manager';
import {
  PageId,
  StoreCategory,
  getLegacyRedirect,
  getPageIdFromPath,
  getPageRoute,
  getStoreCategoryFromPath,
  getStoreCategoryRoute,
} from '@/components/gallery/page-data';
import { HeroScene } from '@/components/media/scenes/hero-scene-updated';
import { PageCardGallery } from '@/components/gallery/page-card-gallery';
import { PageViewer } from '@/components/gallery/page-viewer';
import { AltimeterNavGallery } from '@/components/gallery/altimeter-nav-gallery';

import { MobileControls } from '@/components/ui/mobile-controls';
import { trackPageView } from '@/lib/analytics';

const StoryScene = lazy(() =>
  import('@/components/media/scenes/story-scene').then((module) => ({ default: module.StoryScene }))
);
const ExperienceScene = lazy(() =>
  import('@/components/media/scenes/experience-scene').then((module) => ({ default: module.ExperienceScene }))
);
const StoreScene = lazy(() =>
  import('@/components/media/scenes/store-scene').then((module) => ({ default: module.StoreScene }))
);
const ProductScene = lazy(() =>
  import('@/components/media/scenes/product-scene').then((module) => ({ default: module.ProductScene }))
);
const FullCocktailsScene = lazy(() =>
  import('@/components/media/scenes/cocktails-scene').then((module) => ({ default: module.FullCocktailsScene }))
);

import { useGinEditions } from '@/hooks/use-gin-editions';
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
  const [logoScrollOffset, setLogoScrollOffset] = useState(0);

  // Keep the logo pinned to the page content (not the screen): it
  // scrolls up and off-screen in lockstep with the active scene,
  // instead of staying fixed to the viewport or fading out on a delay.
  useEffect(() => {
    if (navState.viewMode !== 'page') {
      setLogoScrollOffset(0);
      return;
    }

    let rafId: number;
    const update = () => {
      const container = document.querySelector('.scroll-smooth-container');
      setLogoScrollOffset(container ? container.scrollTop : 0);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, true);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [navState.viewMode, navState.selectedPage]);

  // Scroll position tracking for scenes that need it
  const [sceneScrollPositions, setSceneScrollPositions] = useState<Record<number, any>>({});
  const { classic: classicData, limited: limitedData } = useGinEditions();
  const storeCategory = getStoreCategoryFromPath(location);

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

  // Keep old bookmarked/newsletter links alive (/sets -> /store/sets).
  useEffect(() => {
    const redirect = getLegacyRedirect(location);

    if (redirect) {
      setLocation(redirect, { replace: true });
    }
  }, [location, setLocation]);

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

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  const handleOpenPage = useCallback((pageId: PageId) => {
    const nextPath = getPageRoute(pageId);

    if (location !== nextPath) {
      setLocation(nextPath);
    }

    openPage(pageId);
  }, [location, openPage, setLocation]);

  // Category shelves are their own URLs so they can be linked and measured,
  // but they stay inside the already-open store page - no scene transition.
  const handleSelectStoreCategory = useCallback((category: StoreCategory) => {
    setLocation(getStoreCategoryRoute(category));
  }, [setLocation]);

  const handleReturnToStore = useCallback(() => {
    setLocation(getPageRoute('store'));
  }, [setLocation]);

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

      case 'store':
        return (
          <Suspense fallback={pageLoadingFallback}>
            <StoreScene
              isActive={true}
              onScrollPositionChange={handleSceneScrollPosition(3)}
              category={storeCategory}
              onSelectCategory={handleSelectStoreCategory}
              onReturnToStore={handleReturnToStore}
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

      case 'journey':
        // Coming soon — no active scene
        return null;

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
        <header
          className="fixed top-0 left-0 p-4 md:p-6 lg:p-8 z-[70]"
          style={{ transform: `translateY(-${logoScrollOffset}px)` }}
        >
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



      {/* Mobile Controls - Language & Contact buttons (Mobile only) */}
      {navState.viewMode === 'hero' && isHeroGalleryVisible && <MobileControls />}

    </div>
  );
}
