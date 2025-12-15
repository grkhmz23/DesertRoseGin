import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AltimeterNavProps = {
  currentSceneIndex: number;
  sceneProgress: number; // 0..1 within current scene
  totalScenes: number;
  labels: string[];
  onSelect: (index: number) => void;
};

export function AltimeterNav({
  currentSceneIndex,
  sceneProgress,
  totalScenes,
  labels,
  onSelect,
}: AltimeterNavProps) {
  const activeFill = useMemo(() => {
    const clamped = Math.max(0, Math.min(1, sceneProgress));
    return (currentSceneIndex + clamped) / Math.max(1, totalScenes - 1);
  }, [currentSceneIndex, sceneProgress, totalScenes]);

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 select-none">
      <div className="relative flex items-center gap-4">
        {/* Scale */}
        <div className="relative h-[260px] md:h-[320px] w-[28px]">
          {/* Track */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[2px] bg-white/10" />

          {/* Active fill */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[2px] bg-[color:var(--drg-accent)]"
            style={{ height: `${activeFill * 100}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
          />

          {/* Notches + handles */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {Array.from({ length: totalScenes }).map((_, i) => {
              const isActive = i === currentSceneIndex;
              return (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  className="group relative h-8 w-full flex items-center justify-center"
                  data-cursor="button"
                  data-cursor-text={labels[i] || ""}
                  aria-label={labels[i] || `Scene ${i + 1}`}
                >
                  {/* notch */}
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 h-[1px] w-4 md:w-5 transition-all duration-300",
                      isActive ? "bg-[color:var(--drg-accent)]" : "bg-white/15 group-hover:bg-white/25"
                    )}
                  />

                  {/* active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, var(--drg-accent) 0%, rgba(0,0,0,0) 70%)",
                        filter: "blur(0px)",
                      }}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Labels (only show on md+, fade in for active/hover) */}
        <div className="hidden md:flex flex-col justify-between h-[320px] py-1">
          {labels.map((label, i) => {
            const isActive = i === currentSceneIndex;
            return (
              <button
                key={label}
                onClick={() => onSelect(i)}
                className={cn(
                  "text-left font-hud text-[10px] uppercase tracking-[0.28em] transition-all duration-300",
                  isActive ? "text-[color:var(--drg-accent)] opacity-100" : "text-white/35 hover:text-white/55"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Subtle glass plate */}
        <div
          className="absolute -inset-3 rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
          }}
        />
      </div>
    </div>
  );
}
