import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ParallaxBottleProps {
  src: string;
  alt: string;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glowColor?: string;
}

/**
 * ParallaxBottle
 * 
 * Premium 3D bottle presentation with:
 * - Mouse-follow tilt effect
 * - Glass reflection overlay
 * - Breathing scale animation
 * - Hover interactions with glow
 * - Dynamic shadow
 */
export function ParallaxBottle({
  src,
  alt,
  className = "",
  maxTilt = 15,
  scale = 1.05,
  glowColor = "rgba(205, 126, 49, 0.4)",
}: ParallaxBottleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid motion
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation values
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Reflection position follows inverse of tilt
  const reflectionX = useTransform(smoothX, [-0.5, 0.5], ["60%", "40%"]);
  const reflectionY = useTransform(smoothY, [-0.5, 0.5], ["70%", "30%"]);

  // Shadow offset based on tilt
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [-10, 30]);
  const shadowBlur = useTransform(
    smoothY,
    [-0.5, 0.5],
    [40, 60]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -0.5 to 0.5 range
    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to center
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      data-bottle
    >
      {/* Ambient glow behind bottle */}
      <motion.div
        className="absolute w-[80%] h-[80%] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.4,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Dynamic shadow */}
      <motion.div
        className="absolute bottom-0 w-[60%] h-[20px] rounded-[50%] pointer-events-none"
        style={{
          x: shadowX,
          y: shadowY,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)",
          filter: useTransform(shadowBlur, (v) => `blur(${v}px)`),
        }}
        animate={{
          scaleX: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main bottle container with 3D transform */}
      <motion.div
        className="relative z-10"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? scale : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        {/* Breathing animation wrapper */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.01, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Bottle image */}
          <motion.img
            src={src}
            alt={alt}
            className="h-full w-auto object-contain drop-shadow-2xl"
            style={{
              filter: isHovered
                ? "drop-shadow(0 25px 50px rgba(0,0,0,0.5))"
                : "drop-shadow(0 15px 30px rgba(0,0,0,0.3))",
            }}
            draggable={false}
          />

          {/* Glass reflection overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              background: useTransform(
                [reflectionX, reflectionY],
                ([x, y]) =>
                  `radial-gradient(ellipse at ${x} ${y}, rgba(255,255,255,0.15) 0%, transparent 50%)`
              ),
              mixBlendMode: "overlay",
            }}
          />

          {/* Edge highlight */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
              mixBlendMode: "overlay",
              opacity: isHovered ? 1 : 0.5,
            }}
            animate={{
              opacity: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Specular highlight dot */}
          <motion.div
            className="absolute top-[15%] left-[55%] w-2 h-2 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
              filter: "blur(1px)",
            }}
            animate={{
              opacity: isHovered ? [0.6, 1, 0.6] : 0.4,
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Hover interaction hint */}
      <motion.div
        className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isHovered ? 0 : 0.5,
          y: isHovered ? -10 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-hud text-[9px] uppercase tracking-[0.3em] text-[#CD7E31]/60">
          Interact
        </span>
      </motion.div>

      {/* Particle sparkles on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#CD7E31]"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: -30,
                x: (Math.random() - 0.5) * 30,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/**
 * SimpleParallaxBottle
 * 
 * Lighter version without mouse tracking
 * Just breathing animation and hover scale
 */
export function SimpleParallaxBottle({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-bottle
    >
      {/* Glow */}
      <motion.div
        className="absolute w-[70%] h-[70%] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(205, 126, 49, 0.3) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          opacity: isHovered ? 0.7 : 0.3,
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Breathing wrapper */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          scale: isHovered ? 1.03 : [1, 1.01, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-auto object-contain drop-shadow-2xl"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}
