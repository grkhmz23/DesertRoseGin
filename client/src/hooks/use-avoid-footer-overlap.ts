import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Measures the distance from a fixed-position element to the nearest
 * visible [data-brand-footer] element and returns how far the element
 * needs to shift upward to avoid overlapping it.
 */
export function useAvoidFooterOverlap<T extends HTMLElement>(active: boolean): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [pushUp, setPushUp] = useState(0);

  useEffect(() => {
    if (!active) return;

    let rafId: number;

    const update = () => {
      const el = ref.current;
      if (!el) return;

      const footers = document.querySelectorAll<HTMLElement>('[data-brand-footer]');
      let nearestFooterTop = Infinity;
      footers.forEach((footerEl) => {
        const rect = footerEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          nearestFooterTop = Math.min(nearestFooterTop, rect.top);
        }
      });

      if (nearestFooterTop === Infinity) {
        setPushUp(0);
        return;
      }

      const elRect = el.getBoundingClientRect();
      const overlap = elRect.bottom - nearestFooterTop;
      setPushUp(overlap > 0 ? overlap : 0);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [active]);

  return [ref, pushUp];
}
