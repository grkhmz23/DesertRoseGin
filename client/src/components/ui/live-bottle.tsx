import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface LiveBottleProps {
  src: string;
  alt: string;
  className?: string;
}

export function LiveBottle({ src, alt, className }: LiveBottleProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth physics for the tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  // Light Reflection Physics (The "3D" trick)
  // Moves the light opposite to the bottle rotation to simulate real glass
  const lightX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 150, damping: 20 });
  const sheenOpacity = useTransform(x, [-0.5, 0, 0.5], [0.3, 0.6, 0.3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    // Calculate mouse position from -0.5 to 0.5 (center is 0)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transformStyle: "preserve-3d",
        rotateX,
        rotateY
      }}
    >
      {/* The Bottle Image */}
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain drop-shadow-2xl"
        style={{ pointerEvents: 'none' }} 
      />

      {/* THE MAGIC: Dynamic Light Reflection Layer 
          We use the image itself as a mask, so the light only shines ON the bottle
      */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
        style={{
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`, // For Safari
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,0.0) 50%)",
          backgroundSize: "200% 100%", // Double width so we can slide it
          backgroundPositionX: lightX, // Move the light based on mouse
          opacity: sheenOpacity
        }}
      />

      {/* Optional: Deep Shadow for depth */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/40 blur-xl rounded-[100%]"
        style={{ 
          scale: useTransform(y, [-0.5, 0.5], [0.9, 1.1]),
          opacity: useTransform(y, [-0.5, 0.5], [0.6, 0.3])
        }}
      />
    </motion.div>
  );
}