import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface CursorState {
  isHovering: boolean;
  hoverType: "default" | "button" | "link" | "card" | "bottle" | "text";
  hoverText: string;
  isPressed: boolean;
  isHidden: boolean;
}

/**
 * MagneticCursor
 * 
 * Premium custom cursor with:
 * - Smooth following motion
 * - Magnetic pull to interactive elements
 * - Context-aware states (button, link, card, bottle)
 * - Expanding ring with label on hover
 */
export function MagneticCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [state, setState] = useState<CursorState>({
    isHovering: false,
    hoverType: "default",
    hoverText: "",
    isPressed: false,
    isHidden: false,
  });

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const magneticTargetRef = useRef<HTMLElement | null>(null);

  // Smooth spring for outer ring (slower, more fluid)
  const springConfig = { damping: 22, stiffness: 520, mass: 0.28 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Faster spring for inner dot
  const fastSpringConfig = { damping: 28, stiffness: 1200, mass: 0.15 };
  const fastX = useSpring(cursorX, fastSpringConfig);
  const fastY = useSpring(cursorY, fastSpringConfig);

  // Check for touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
    window.addEventListener("touchstart", () => setIsTouchDevice(true), { once: true });
  }, []);

  // Handle mouse movement with magnetic effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    let targetX = e.clientX;
    let targetY = e.clientY;

    // Magnetic pull effect when hovering interactive elements
    if (magneticTargetRef.current && state.isHovering) {
      const rect = magneticTargetRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Pull cursor toward center (20% magnetic strength)
      const pullStrength = 0.2;
      targetX = e.clientX + (centerX - e.clientX) * pullStrength;
      targetY = e.clientY + (centerY - e.clientY) * pullStrength;
    }

    cursorX.set(targetX);
    cursorY.set(targetY);
  }, [cursorX, cursorY, state.isHovering]);

  const handleMouseDown = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  // Detect interactive elements on hover
  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check for data attributes first
    const cursorType = target.closest("[data-cursor]")?.getAttribute("data-cursor");
    const cursorText = target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");
    
    if (cursorType) {
      magneticTargetRef.current = target.closest("[data-cursor]") as HTMLElement;
      setState(prev => ({
        ...prev,
        isHovering: true,
        hoverType: cursorType as CursorState["hoverType"],
        hoverText: cursorText || "",
      }));
      return;
    }

    // Auto-detect interactive elements
    const button = target.closest("button, [role='button'], .acquire-button");
    const link = target.closest("a");
    const card = target.closest("[data-card]");
    const bottle = target.closest("[data-bottle]");

    if (button) {
      magneticTargetRef.current = button as HTMLElement;
      setState(prev => ({
        ...prev,
        isHovering: true,
        hoverType: "button",
        hoverText: button.getAttribute("data-cursor-text") || "",
      }));
    } else if (link) {
      magneticTargetRef.current = link as HTMLElement;
      setState(prev => ({
        ...prev,
        isHovering: true,
        hoverType: "link",
        hoverText: "",
      }));
    } else if (card) {
      magneticTargetRef.current = card as HTMLElement;
      setState(prev => ({
        ...prev,
        isHovering: true,
        hoverType: "card",
        hoverText: "Drag",
      }));
    } else if (bottle) {
      magneticTargetRef.current = bottle as HTMLElement;
      setState(prev => ({
        ...prev,
        isHovering: true,
        hoverType: "bottle",
        hoverText: "",
      }));
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    magneticTargetRef.current = null;
    setState(prev => ({
      ...prev,
      isHovering: false,
      hoverType: "default",
      hoverText: "",
    }));
  }, []);

  const handleVisibilityChange = useCallback(() => {
    setState(prev => ({ ...prev, isHidden: document.hidden }));
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Event delegation for hover states
    const handleOver = (e: Event) => handleMouseEnter(e as MouseEvent);
    const handleOut = () => handleMouseLeave();

    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    // Hide default cursor

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [isTouchDevice, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave, handleVisibilityChange]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  const getCursorSize = () => {
    if (state.isPressed) return 32;
    switch (state.hoverType) {
      case "button": return 80;
      case "link": return 50;
      case "card": return 70;
      case "bottle": return 100;
      default: return state.isHovering ? 50 : 40;
    }
  };

  const getDotSize = () => {
    if (state.isPressed) return 4;
    return state.isHovering ? 0 : 8;
  };

  const getBorderColor = () => {
    switch (state.hoverType) {
      case "button": return "rgba(205, 126, 49, 0.9)";
      case "link": return "rgba(205, 126, 49, 0.7)";
      case "card": return "rgba(232, 220, 202, 0.6)";
      case "bottle": return "rgba(145, 125, 55, 0.6)";
      default: return "rgba(232, 220, 202, 0.4)";
    }
  };

  return (
    <>
      {/* Outer ring - smooth follow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ x: smoothX, y: smoothY }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            width: getCursorSize(),
            height: getCursorSize(),
            x: -getCursorSize() / 2,
            y: -getCursorSize() / 2,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Ring border */}
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            animate={{
              borderColor: getBorderColor(),
              scale: state.isPressed ? 0.9 : 1,
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Glow effect for bottle hover */}
          {state.hoverType === "bottle" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              style={{
                background: "radial-gradient(circle, rgba(205, 126, 49, 0.4) 0%, transparent 70%)",
                filter: "blur(10px)",
              }}
            />
          )}

          {/* Hover text label */}
          {state.hoverText && (
            <motion.span
              className="absolute text-[10px] font-hud uppercase tracking-[0.2em] text-[#E8DCCA] whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {state.hoverText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner dot - fast follow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10001]"
        style={{ x: fastX, y: fastY }}
      >
        <motion.div
          className="rounded-full bg-[#CD7E31]"
          animate={{
            width: getDotSize(),
            height: getDotSize(),
            x: -getDotSize() / 2,
            y: -getDotSize() / 2,
            opacity: getDotSize() > 0 ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
        />
      </motion.div>
    </>
  );
}

/**
 * Hook to add cursor attributes to elements
 * Usage: <button {...useMagneticCursor("button", "Click me")}>
 */
export function useMagneticCursor(type: CursorState["hoverType"] = "button", text?: string) {
  return {
    "data-cursor": type,
    "data-cursor-text": text,
  };
}
