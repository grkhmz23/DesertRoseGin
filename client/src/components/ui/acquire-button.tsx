import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export interface AcquireButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  label?: string;
  variant?: "dark" | "light";
}

export function AcquireButton({
  label = "Order",
  variant = "dark",
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

  // UPDATED: Colors based on variant - no orange, use text color but brighter
  const isDark = variant === "dark";
  const borderColor = isDark ? "border-[#F5EFE6]/50" : "border-[#2B1810]/50";
  const borderHoverColor = isDark ? "hover:border-[#F5EFE6]" : "hover:border-[#2B1810]";
  const textColor = isDark ? "text-[#F5EFE6]" : "text-[#2B1810]";
  const bgColor = isDark ? "bg-[#2B1810]/40" : "bg-[#E8DCCA]/40";
  const fillColor = isDark ? "bg-[#F5EFE6]" : "bg-[#2B1810]";
  const hoverTextColor = isDark ? "text-[#2B1810]" : "text-[#F5EFE6]";

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      // UPDATED: Sharp corners (removed ), text-matching colors
      className={`relative overflow-hidden border-0 ${bgColor} px-8 py-3 text-xs md:text-sm font-normal tracking-[0.2em] uppercase ${textColor} backdrop-blur-md transition-colors duration-500 ${className}`}
      data-cursor="button"
      data-cursor-text="Order"
      {...(props as any)}
    >
      {/* Fill Effect - uses text color instead of orange */}
      <motion.div
        className={`absolute inset-0 z-0 ${fillColor}`}
        initial={{ y: "100%" }}
        animate={{ y: isHovered ? "0%" : "100%" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      />

      <div className="relative z-10 flex items-center gap-3">
        <span className={`transition-colors duration-300 ${isHovered ? hoverTextColor : textColor}`}>
          {label}
        </span>
        <ShoppingBag
          className={`h-4 w-4 stroke-[1.6] transition-colors duration-300 ${isHovered ? hoverTextColor : textColor}`}
        />
      </div>
    </motion.button>
  );
}
