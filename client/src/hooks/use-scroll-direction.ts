import { useEffect, useRef, useState } from 'react';

/**
 * Detects scroll direction across any overflow container in the page.
 * Uses capture-phase scroll listener so it picks up events from nested
 * overflow containers (the app uses fixed inset-0 overflow-hidden root).
 *
 * Returns `hidden: true` when the user scrolls down, `false` when scrolling
 * up or when near the top of any scrollable container.
 *
 * @param resetKey - When this value changes the hidden state is reset to false
 *                   (pass the current pageId so navigation always reveals the header)
 */
export function useScrollDirection(resetKey?: string | null) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Reset whenever the page changes
    setHidden(false);
    lastScrollY.current = 0;
  }, [resetKey]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.scrollTop === 'undefined') return;

      if (rafId.current !== null) return; // already queued

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const currentY = target.scrollTop;
        const delta = currentY - lastScrollY.current;

        if (currentY < 50) {
          // Near the top — always show
          setHidden(false);
        } else if (delta > 5) {
          // Scrolled down enough
          setHidden(true);
        } else if (delta < -5) {
          // Scrolled up enough
          setHidden(false);
        }

        lastScrollY.current = currentY;
      });
    };

    // Capture phase so we receive events from nested overflow containers
    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener('scroll', handleScroll, { capture: true });
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return hidden;
}
