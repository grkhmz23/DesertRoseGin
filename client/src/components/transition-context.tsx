import React, { createContext, useContext, useState, useRef, ReactNode } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  triggerTransition: (callback: () => void) => void;
  transitionRef: React.RefObject<any>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef(null);

  const triggerTransition = (callback: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // INSTANT TRIGGER: We start the logic immediately so the scenes can animate themselves
    callback();

    // Small cooldown to prevent rapid-fire scrolling
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); 
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, triggerTransition, transitionRef }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}