import { createContext, useContext, ReactNode, useRef, useCallback, useState } from "react";
import { SandstormTransitionRef } from "@/components/ui/sandstorm-transition";

interface TransitionContextType {
  sandstormRef: React.RefObject<SandstormTransitionRef>;
  triggerTransition: (onCovered?: () => void) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const sandstormRef = useRef<SandstormTransitionRef>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback((onCovered?: () => void) => {
    if (sandstormRef.current && !isTransitioning) {
      setIsTransitioning(true);
      sandstormRef.current.startStorm(
        () => {
          if (onCovered) {
            onCovered();
          }
        },
        () => {
          setIsTransitioning(false);
        }
      );
    }
  }, [isTransitioning]);

  return (
    <TransitionContext.Provider value={{ sandstormRef, triggerTransition, isTransitioning }}>
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
