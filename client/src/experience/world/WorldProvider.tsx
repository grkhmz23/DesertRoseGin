import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./world.css";

export type WorldMode = "cinematic" | "performance";

type WorldState = {
  world: number;               // 0..1
  setWorld: (v: number) => void;

  mode: WorldMode;
  setMode: (m: WorldMode) => void;

  reducedMotion: boolean;
};

const WorldCtx = createContext<WorldState | null>(null);

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function detectReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function detectPerformanceMode(): WorldMode {
  if (typeof window === "undefined") return "cinematic";
  const dm = (navigator as any).deviceMemory as number | undefined;
  const hc = navigator.hardwareConcurrency ?? 4;
  const lowMemory = typeof dm === "number" && dm <= 4;
  const lowCPU = hc <= 4;
  const isMobileUA = /iPhone|iPad|Android/i.test(navigator.userAgent);
  return (lowMemory || lowCPU || isMobileUA) ? "performance" : "cinematic";
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const k = clamp01(t);
  return rgbToHex(
    Math.round(A.r + (B.r - A.r) * k),
    Math.round(A.g + (B.g - A.g) * k),
    Math.round(A.b + (B.b - A.b) * k),
  );
}

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [world, _setWorld] = useState(0);
  const [mode, _setMode] = useState<WorldMode>(() => detectPerformanceMode());
  const [reducedMotion, setReducedMotion] = useState(false);

  const setWorld = useCallback((v: number) => _setWorld(clamp01(v)), []);
  const setMode = useCallback((m: WorldMode) => _setMode(m), []);

  useEffect(() => {
    setReducedMotion(detectReducedMotion());

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq?.addEventListener) return;

    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // publish world for CSS + debugging
    root.style.setProperty("--drg-world", String(world));

    // Classic -> Noir palette blend
    const classicAccent = "#CD7E31";
    const noirAccent = "#7E5BD9";
    const classicHighlight = "#E8DCCA";
    const noirHighlight = "#CBB27A";

    const accent = mixHex(classicAccent, noirAccent, world);
    const highlight = mixHex(classicHighlight, noirHighlight, world);
    const accentSoft = mixHex(accent, "#050606", 0.35);

    root.style.setProperty("--drg-accent", accent);
    root.style.setProperty("--drg-accent-soft", accentSoft);
    root.style.setProperty("--drg-highlight", highlight);

    root.dataset.worldMode = mode;
    root.dataset.reducedMotion = reducedMotion ? "true" : "false";
  }, [world, mode, reducedMotion]);

  const value = useMemo<WorldState>(
    () => ({ world, setWorld, mode, setMode, reducedMotion }),
    [world, setWorld, mode, setMode, reducedMotion]
  );

  return <WorldCtx.Provider value={value}>{children}</WorldCtx.Provider>;
}

export function useWorld() {
  const v = useContext(WorldCtx);
  if (!v) throw new Error("useWorld must be used inside WorldProvider");
  return v;
}

export function useSetWorld() {
  return useWorld().setWorld;
}

/**
 * Backward-compatible name you already used in places.
 * Now it actually includes mode + reducedMotion too.
 */
export function useWorldValue() {
  const { world, setWorld, mode, setMode, reducedMotion } = useWorld();
  return { world, setWorld, mode, setMode, reducedMotion };
}


/**
 * Compatibility helper for older code paths.
 * Keep until all call sites are migrated to useWorld()/useWorldValue().
 */
export function useWorldPolicy() {
  const { mode, reducedMotion } = useWorld();
  const cinematic = mode === "cinematic" && !reducedMotion;
  return { mode, reducedMotion, cinematic };
}
