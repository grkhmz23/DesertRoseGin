"use client";
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RockingBottleProps {
  src: string;
  alt: string;
  isActive: boolean;
  className?: string;
}

export function RockingBottle({ src, alt, isActive, className = "" }: RockingBottleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<'forward' | 'backward'>('forward');
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const animate = () => {
      if (!video) return;
      
      const step = 0.033;
      
      if (directionRef.current === 'forward') {
        if (video.currentTime >= video.duration - 0.1) {
          directionRef.current = 'backward';
        } else {
          video.currentTime = Math.min(video.currentTime + step, video.duration);
        }
      } else {
        if (video.currentTime <= 0.1) {
          directionRef.current = 'forward';
        } else {
          video.currentTime = Math.max(video.currentTime - step, 0);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    video.pause();
    video.currentTime = 0;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain max-h-[70vh]"
      />
    </motion.div>
  );
}
