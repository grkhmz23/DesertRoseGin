import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AltimeterNavProps = {
  currentSceneIndex: number;
  sceneProgress: number;
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
      {/* CLIENT FIX: Removed the "Glass Plate" background container completely. 
          Just the track and text remain, floating cleanly. */}
      <div className="relative flex items-center gap-6 p-4">

        <div className="relative z-10 flex items-center gap-6">
          <div className="relative h-[260px] md:h-[320px] w-[2px]">
            {/* Track - made slightly more visible against the dark brown background */}
            <div className="absolute inset-0 rounded-full overflow-hidden bg-[#F5EFE6]/10">
              <motion.div
                className="absolute left-0 top-0 w-full bg-[#CD7E31]"
                style={{ height: `${activeFill * 100}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 26 }}
              />
            </div>

            <div className="absolute inset-y-0 -left-4 w-9 flex flex-col justify-between py-0">
              {Array.from({ length: totalScenes }).map((_, i) => {
                const isActive = i === currentSceneIndex;
                return (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    className="group relative h-4 w-full flex items-center justify-center outline-none"
                    aria-label={labels[i] || `Scene ${i + 1}`}
                  >
                    <div className={cn("absolute right-[18px] h-[1px] transition-all duration-500 rounded-full", isActive ? "w-6 bg-[#CD7E31] opacity-100" : "w-3 bg-[#F5EFE6]/40 group-hover:w-5 group-hover:bg-[#F5EFE6]/80")} />
                    {isActive && (
                      <motion.div layoutId="active-dot" className="absolute right-[18px] translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#CD7E31] shadow-[0_0_10px_#CD7E31]" transition={{ duration: 0.3 }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex flex-col justify-between h-[320px] py-0 text-right">
            {labels.map((label, i) => (
              <button key={label} onClick={() => onSelect(i)} className={cn("font-hud text-[9px] uppercase tracking-[0.3em] transition-all duration-500 text-right h-4 flex items-center justify-end", i === currentSceneIndex ? "text-[#CD7E31] opacity-100 translate-x-0 font-bold" : "text-[#F5EFE6]/40 hover:text-[#F5EFE6]/80 -translate-x-1")}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}