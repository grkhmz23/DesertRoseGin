import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface LiveBottleProps {
  src: string;
  alt: string;
  isActive?: boolean;
  className?: string;
  imageClassName?: string;
}

export function LiveBottle({
  src,
  alt,
  isActive = true,
  className = '',
  imageClassName = '',
}: LiveBottleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 20 };
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-5, 5]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full max-w-md max-h-[400px] md:max-h-[600px] flex items-center justify-center ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: isActive ? 1 : 0, 
          scale: isActive ? 1 : 0.9,
          y: isActive ? 0 : 20
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          className={`w-auto h-full max-h-[400px] md:max-h-[550px] object-contain ${imageClassName}`}
          style={{
            filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.3))",
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}
