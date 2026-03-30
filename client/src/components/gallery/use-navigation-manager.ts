import { useState, useCallback } from 'react';
import { PageId, ViewMode } from './page-data';
import { useTransition } from '@/components/transition-context';

export interface NavigationState {
  viewMode: ViewMode;
  selectedPage: PageId | null;
  lastGalleryPage: PageId | null;
  previousMode: ViewMode | null;
}

export function useNavigationManager() {
  const { triggerTransition, isTransitioning } = useTransition();
  
  const [navState, setNavState] = useState<NavigationState>({
    viewMode: 'hero',
    selectedPage: null,
    lastGalleryPage: null,
    previousMode: null,
  });

  // Hero intro → Hero with cards
  const enterGallery = useCallback(() => {
    if (isTransitioning) return;
  }, [isTransitioning]);

  // Gallery → Full Page
  const openPage = useCallback((pageId: PageId) => {
    if (isTransitioning) {
      return;
    }

    if (navState.viewMode === "page" && navState.selectedPage === pageId) {
      return;
    }
    
    triggerTransition(() => {
      setNavState({
        viewMode: 'page',
        selectedPage: pageId,
        lastGalleryPage: pageId,
        previousMode: navState.viewMode,
      });
    });
  }, [isTransitioning, navState.selectedPage, navState.viewMode, triggerTransition]);

  // Full Page → Hero with cards
  const returnToGallery = useCallback(() => {
    if (isTransitioning || navState.viewMode !== 'page') return;
    
    triggerTransition(() => {
      setNavState({
        viewMode: 'hero',
        selectedPage: null,
        lastGalleryPage: navState.lastGalleryPage,
        previousMode: 'page',
      });
    });
  }, [isTransitioning, navState.lastGalleryPage, navState.viewMode, triggerTransition]);

  // Reset to hero (if needed)
  const resetToHero = useCallback(() => {
    if (isTransitioning) return;
    
    triggerTransition(() => {
      setNavState({
        viewMode: 'hero',
        selectedPage: null,
        lastGalleryPage: navState.lastGalleryPage,
        previousMode: navState.viewMode,
      });
    });
  }, [isTransitioning, navState.lastGalleryPage, navState.viewMode, triggerTransition]);

  return {
    navState,
    enterGallery,
    openPage,
    returnToGallery,
    resetToHero,
    isTransitioning,
  };
}
