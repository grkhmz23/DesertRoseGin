import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [cursorState, setCursorState] = useState<"default" | "pointer" | "text">("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices for performance
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.closest("button") || target.closest("a") || target.closest("[role='button']");
      const isText = target.closest("p") || target.closest("h1") || target.closest("h2") || target.closest("h3");

      if (isButton) setCursorState("pointer");
      else if (isText) setCursorState("text");
      else setCursorState("default");
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      style={{ x: cursorXSpring, y: cursorYSpring, backgroundColor: "#E8DCCA" }}
      animate={{
        scale: cursorState === "pointer" ? 0.3 : cursorState === "text" ? 1.5 : 1,
        opacity: cursorState === "text" ? 0.5 : 1,
      }}
      transition={{ duration: 0.2 }}
    />
  );
}
