import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type WorldMode = "cinematic" | "performance";

export type WorldState = {
  world: number; // 0..1
  setWorld: (v: number) => void;

  mode: WorldMode;
  setMode: (m: WorldMode) => void;

  reducedMotion: boolean;
};

const Ctx = createContext<WorldState | null>(null);

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
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  return (lowMemory || lowCPU || isMobile) ? "performance" : "cinematic";
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
}

function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const tt = clamp01(t);
  return rgbToHex(
    A.r + (B.r - A.r) * tt,
    A.g + (B.g - A.g) * tt,
    A.b + (B.b - A.b) * tt
  );
}

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [world, setWorldRaw] = useState(0);
  const [mode, setMode] = useState<WorldMode>(() => detectPerformanceMode());
  const [reducedMotion, setReducedMotion] = useState(() => detectReducedMotion());

  const setWorld = (v: number) => setWorldRaw(clamp01(v));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const onChange = () => setReducedMotion(!!mq.matches);
    onChange();

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else (mq as any).addListener?.(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else (mq as any).removeListener?.(onChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.style.setProperty("--drg-world", String(world));

    // Classic -> Noir blend (brand-safe)
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

  const value = useMemo(() => ({ world, setWorld, mode, setMode, reducedMotion }), [world, mode, reducedMotion]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorld() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWorld must be used inside WorldProvider");
  return v;
}

export function useWorldPolicy() {
  const { mode, reducedMotion } = useWorld();
  return { mode, reducedMotion };
}

export function useWorldValue() {
  const { world, setWorld, mode, reducedMotion } = useWorld();
  return { world, setWorld, mode, reducedMotion };
}

export function useSetWorld() {
  return useWorld().setWorld;
}
