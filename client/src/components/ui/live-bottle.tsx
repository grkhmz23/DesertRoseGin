import { motion } from 'framer-motion';
import { useState } from 'react';

interface LiveBottleProps {
  src: string;
  alt: string;
  isActive?: boolean;
  className?: string;
}

export function LiveBottle({ src, alt, isActive = true, className = '' }: LiveBottleProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = (e.clientX - rect.left - rect.width / 2) / 20;
    setRotation({ x: -x, y: y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`relative w-full h-full max-w-md max-h-[600px] flex items-center justify-center ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      style={{ perspective: 1000 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-auto h-full max-h-[500px] object-contain drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.8
        }}
        transition={{ duration: 0.8 }}
        draggable={false}
      />
    </motion.div>
  );
}
