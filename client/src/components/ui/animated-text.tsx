import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

// Animation variant types
type AnimationVariant = "fade-up" | "fade-down" | "blur-in" | "slide-right" | "slide-left" | "scale" | "rotate";

// Character animation variants
const charVariants: Record<AnimationVariant, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  "blur-in": {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  "scale": {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },
  "rotate": {
    hidden: { opacity: 0, rotate: -10, y: 10 },
    visible: { opacity: 1, rotate: 0, y: 0 },
  },
};

// ============================================
// AnimatedText - Character by character reveal
// ============================================
interface AnimatedTextProps {
  text: string;
  variant?: AnimationVariant;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  onComplete?: () => void;
  triggerOnView?: boolean;
  viewThreshold?: number;
}

export function AnimatedText({
  text,
  variant = "fade-up",
  className = "",
  staggerDelay = 0.03,
  initialDelay = 0,
  duration = 0.5,
  tag = "div",
  onComplete,
  triggerOnView = true,
  viewThreshold = 0.3,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: viewThreshold });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const characters = text.split("");
  const Tag: any = tag as keyof JSX.IntrinsicElements;

  useEffect(() => {
    if ((triggerOnView && isInView && !hasAnimated) || (!triggerOnView && !hasAnimated)) {
      controls.start("visible").then(() => {
        setHasAnimated(true);
        onComplete?.();
      });
    }
  }, [isInView, triggerOnView, hasAnimated, controls, onComplete]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <Tag ref={ref as any} className={className}>
      <motion.span
        className="inline-block"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            variants={charVariants[variant]}
            transition={{
              duration,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ 
              whiteSpace: char === " " ? "pre" : "normal",
              minWidth: char === " " ? "0.25em" : "auto",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

// ============================================
// AnimatedParagraph - Word by word reveal
// ============================================
interface AnimatedParagraphProps {
  text: string;
  variant?: AnimationVariant;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  triggerOnView?: boolean;
}

export function AnimatedParagraph({
  text,
  variant = "fade-up",
  className = "",
  staggerDelay = 0.08,
  initialDelay = 0,
  duration = 0.6,
  triggerOnView = true,
}: AnimatedParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  const words = text.split(" ");

  useEffect(() => {
    if (triggerOnView && isInView) {
      controls.start("visible");
    } else if (!triggerOnView) {
      controls.start("visible");
    }
  }, [isInView, triggerOnView, controls]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <motion.p
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block mr-[0.25em]"
          variants={charVariants[variant]}
          transition={{
            duration,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

// ============================================
// RevealOnScroll - Reveal children on scroll
// ============================================
interface RevealOnScrollProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function RevealOnScroll({
  children,
  variant = "fade-up",
  className = "",
  delay = 0,
  duration = 0.8,
  threshold = 0.2,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={charVariants[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SplitReveal - Split text reveal (top/bottom)
// ============================================
interface SplitRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function SplitReveal({
  text,
  className = "",
  delay = 0,
  duration = 1,
}: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Top half */}
      <motion.div
        className="relative"
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : { y: "100%" }}
        transition={{
          duration,
          delay,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <span className="block">{text}</span>
      </motion.div>

      {/* Decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-current"
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: duration * 0.6,
          delay: delay + duration * 0.5,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </div>
  );
}

// ============================================
// CountUp - Animated number counter
// ============================================
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const delayMs = delay * 1000;
    const durationMs = duration * 1000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime - delayMs;
      
      if (elapsed < 0) return;
      
      if (elapsed >= durationMs) {
        setCount(end);
        clearInterval(timer);
        return;
      }

      // Easing function (ease-out cubic)
      const progress = elapsed / durationMs;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      
      setCount(current);
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, start, end, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ============================================
// TypeWriter - Typewriter effect
// ============================================
interface TypeWriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
}

export function TypeWriter({
  text,
  className = "",
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "|",
  onComplete,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    const delayTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay * 1000);

    return () => clearTimeout(delayTimeout);
  }, [isInView, text, speed, delay, onComplete]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: isTyping ? 1 : [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: isTyping ? 0 : Infinity,
            repeatType: "reverse",
          }}
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  );
}

// ============================================
// GlitchText - Glitch effect on hover/view
// ============================================
interface GlitchTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

export function GlitchText({
  text,
  className = "",
  triggerOnHover = true,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(!triggerOnHover);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => triggerOnHover && setIsGlitching(true)}
      onMouseLeave={() => triggerOnHover && setIsGlitching(false)}
    >
      {/* Base text */}
      <span className="relative z-10">{text}</span>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-[#CD7E31] opacity-70"
            animate={{
              x: [-2, 2, -1, 1, 0],
              y: [1, -1, 0, 1, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            style={{ clipPath: "inset(0 0 50% 0)" }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-[#917D37] opacity-70"
            animate={{
              x: [2, -2, 1, -1, 0],
              y: [-1, 1, 0, -1, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            style={{ clipPath: "inset(50% 0 0 0)" }}
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
}
