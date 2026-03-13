"use client";
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RockingBottleProps {
  src: string;
  alt: string;
  isActive: boolean;
  className?: string;
  startTime?: number;
  endTime?: number;
}

export function RockingBottle({ 
  src, 
  alt, 
  isActive, 
  className = "",
  startTime = 0,
  endTime = 3 
}: RockingBottleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<'forward' | 'backward'>('forward');
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const startAnimation = () => {
      const animate = () => {
        if (!video || !isFinite(video.duration)) return;
        
        const step = 0.008; // Slower for smoother effect
        const minTime = startTime;
        const maxTime = Math.min(endTime, video.duration);
        
        if (directionRef.current === 'forward') {
          if (video.currentTime >= maxTime - 0.05) {
            directionRef.current = 'backward';
          } else {
            video.currentTime = Math.min(video.currentTime + step, maxTime);
          }
        } else {
          if (video.currentTime <= minTime + 0.05) {
            directionRef.current = 'forward';
          } else {
            video.currentTime = Math.max(video.currentTime - step, minTime);
          }
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };

      video.pause();
      video.currentTime = startTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    if (video.readyState >= 2) {
      startAnimation();
    } else {
      video.addEventListener('loadeddata', startAnimation, { once: true });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      video.removeEventListener('loadeddata', startAnimation);
    };
  }, [isActive, startTime, endTime]);

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
        className="w-full h-full object-contain max-h-[min(28vh,15rem)] sm:max-h-[min(31vh,17rem)] md:max-h-[min(35vh,20rem)] mix-blend-multiply"
      />
    </motion.div>
  );
}
