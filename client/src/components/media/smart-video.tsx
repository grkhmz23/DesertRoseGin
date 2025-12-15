import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import { useWorldPolicy } from "@/experience/world/WorldProvider";

type PreloadAttr = "" | "auto" | "metadata" | "none";

type Props = React.VideoHTMLAttributes<HTMLVideoElement> & {
  /**
   * How aggressively we should load/play.
   * - "auto": cinematic plays in-view, performance only on user intent/in-view
   * - "always": always try to autoplay in-view (still respects reduced motion)
   * - "manual": never autoplay, only play() when user clicks
   */
  policy?: "auto" | "always" | "manual";
  /**
   * Intersection threshold required to trigger play.
   */
  threshold?: number;
};

export const SmartVideo = forwardRef<HTMLVideoElement, Props>(function SmartVideo(
  { policy = "auto", threshold = 0.25, muted, playsInline, loop, preload, onClick, ...rest },
  ref
) {
  const innerRef = useRef<HTMLVideoElement | null>(null);
  const { mode, reducedMotion } = useWorldPolicy();

  const setRef = useCallback(
    (node: HTMLVideoElement | null) => {
      innerRef.current = node;
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<HTMLVideoElement | null>).current = node;
    },
    [ref]
  );

  const computed = useMemo(() => {
    const isCinematic = mode === "cinematic" && !reducedMotion;
    const wantsAutoplay =
      !reducedMotion &&
      policy !== "manual" &&
      (policy === "always" || (policy === "auto" && isCinematic));

    // Preload: keep it light unless cinematic.
    const effectivePreload: PreloadAttr = (preload as PreloadAttr) ?? (isCinematic ? "metadata" : "none");

    return { isCinematic, wantsAutoplay, effectivePreload };
  }, [mode, reducedMotion, policy, preload]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    // Always enforce the autoplay-compatible defaults unless explicitly overridden.
    el.muted = muted ?? true;
    el.loop = loop ?? true;
    el.playsInline = playsInline ?? true;

    // Apply preload policy.
    el.preload = computed.effectivePreload as PreloadAttr;

    // If element is display:none, do not load or play.
    const isActuallyVisible = () => !!(el.offsetParent);

    let playing = false;

    const safePause = () => {
      if (!el) return;
      if (!el.paused) el.pause();
      playing = false;
    };

    const safePlay = async () => {
      if (!el) return;
      if (!isActuallyVisible()) return;
      if (!computed.wantsAutoplay) return;

      // If preload was none, promote and load before play.
      if (el.preload === "none") {
        el.preload = computed.isCinematic ? "metadata" : "metadata";
        try { el.load(); } catch {}
      }

      try {
        await el.play();
        playing = true;
      } catch {
        // Autoplay can fail, ignore.
      }
    };

    const onVis = () => {
      if (document.hidden) safePause();
      else if (!playing) void safePlay();
    };

    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          void safePlay();
        } else {
          safePause();
        }
      },
      { threshold }
    );

    io.observe(el);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [computed, muted, loop, playsInline, threshold]);

  const handleClick: React.MouseEventHandler<HTMLVideoElement> = async (e) => {
    // If policy is manual or autoplay failed, click toggles play/pause.
    const el = innerRef.current;
    if (el) {
      try {
        if (el.paused) await el.play();
        else el.pause();
      } catch {}
    }
    onClick?.(e);
  };

  return (
    <video
      ref={setRef}
      onClick={handleClick}
      {...rest}
    />
  );
});
