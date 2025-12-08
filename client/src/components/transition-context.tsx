import { createContext, useContext, ReactNode, useState, useRef, useCallback } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  triggerTransition: (onCovered?: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

interface TransitionProviderProps {
  children: ReactNode;
  transitionDuration?: number;
}

export function TransitionProvider({ 
  children, 
  transitionDuration = 1200 
}: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const onCoveredRef = useRef<(() => void) | null>(null);

  const triggerTransition = useCallback((onCovered?: () => void) => {
    if (isTransitioning) return;
    
    onCoveredRef.current = onCovered || null;
    setIsTransitioning(true);

    setTimeout(() => {
      if (onCoveredRef.current) {
        onCoveredRef.current();
        onCoveredRef.current = null;
      }
    }, transitionDuration / 2);

    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, [isTransitioning, transitionDuration]);

  return (
    <TransitionContext.Provider value={{ isTransitioning, triggerTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
