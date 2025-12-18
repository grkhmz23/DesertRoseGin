import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
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
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Spring Physics
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center (max 15px movement)
    const distanceX = (e.clientX - centerX) * 0.2; 
    const distanceY = (e.clientY - centerY) * 0.2;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-full border border-[#CD7E31]/40 bg-[#050606]/40 px-8 py-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#F5EFE6] backdrop-blur-md transition-colors duration-500 hover:border-[#CD7E31] ${className}`}
      data-cursor="button"
      data-cursor-text="Shop"
      {...(props as any)}
    >
      {/* Liquid Fill Effect */}
      <motion.div
        className="absolute inset-0 z-0 bg-[#CD7E31]"
        initial={{ y: "100%" }}
        animate={{ y: isHovered ? "0%" : "100%" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} // Elegant ease
      />

      <div className="relative z-10 flex items-center gap-3">
        <span className={`transition-colors duration-300 ${isHovered ? "text-[#050606]" : "text-[#F5EFE6]"}`}>
          {label}
        </span>
        <ShoppingBag
          className={`h-4 w-4 stroke-[1.6] transition-colors duration-300 ${isHovered ? "text-[#050606]" : "text-[#F5EFE6]"}`}
        />
      </div>
    </motion.button>
  );
}