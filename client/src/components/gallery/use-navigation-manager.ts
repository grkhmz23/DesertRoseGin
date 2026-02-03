import { useState, useCallback } from 'react';
import { PageId, ViewMode } from './page-data';
import { useTransition } from '@/components/transition-context';

export interface NavigationState {
  viewMode: ViewMode;
  selectedPage: PageId | null;
  previousMode: ViewMode | null;
}

export function useNavigationManager() {
  const { triggerTransition, isTransitioning } = useTransition();
  
  const [navState, setNavState] = useState<NavigationState>({
    viewMode: 'hero',
    selectedPage: null,
    previousMode: null,
  });

  // Hero → Gallery
  const enterGallery = useCallback(() => {
    if (isTransitioning || navState.viewMode === 'gallery') return;
    
    triggerTransition(() => {
      setNavState({
        viewMode: 'gallery',
        selectedPage: null,
        previousMode: 'hero',
      });
    });
  }, [isTransitioning, navState.viewMode, triggerTransition]);

  // Gallery → Full Page
  const openPage = useCallback((pageId: PageId) => {
    if (isTransitioning || navState.viewMode === "page") {
      return;
    }
    
    triggerTransition(() => {
      setNavState({
        viewMode: 'page',
        selectedPage: pageId,
        previousMode: 'gallery',
      });
    });
  }, [isTransitioning, navState.viewMode, triggerTransition]);

  // Full Page → Gallery
  const returnToGallery = useCallback(() => {
    if (isTransitioning || navState.viewMode !== 'page') return;
    
    triggerTransition(() => {
      setNavState({
        viewMode: 'gallery',
        selectedPage: null,
        previousMode: 'page',
      });
    });
  }, [isTransitioning, navState.viewMode, triggerTransition]);

  // Reset to hero (if needed)
  const resetToHero = useCallback(() => {
    if (isTransitioning) return;
    
    triggerTransition(() => {
      setNavState({
        viewMode: 'hero',
        selectedPage: null,
        previousMode: navState.viewMode,
      });
    });
  }, [isTransitioning, navState.viewMode, triggerTransition]);

  return {
    navState,
    enterGallery,
    openPage,
    returnToGallery,
    resetToHero,
    isTransitioning,
  };
}
