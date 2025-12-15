import * as React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export interface AcquireButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  label?: string;
}

export function AcquireButton({
  label = "Acquire",
  className = "",
  ...props
}: AcquireButtonProps) {
  const baseClass =
    "group relative inline-flex items-center gap-2 rounded-full border border-white/30 " +
    "bg-white/5 px-8 py-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase " +
    "text-white/90 backdrop-blur-md transition-all duration-300 " +
    "hover:border-white/80 hover:bg-white/10 hover:text-white " +
    "shadow-[0_0_40px_rgba(255,255,255,0.18)]";

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseClass} ${className}`}
      data-cursor="button"
      data-cursor-text="Shop"
      {...(props as any)}
    >
      {/* Highlight overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/15 via-white/0 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Left glow dot */}
      <span className="pointer-events-none absolute -left-1.5 h-2 w-2 rounded-full bg-white/80 blur-[2px] group-hover:scale-110 group-hover:bg-white" />

      <span className="relative z-10">{label}</span>

      <ShoppingBag
        className="relative z-10 h-4 w-4 stroke-[1.6]"
        aria-hidden="true"
      />
    </motion.button>
  );
}
