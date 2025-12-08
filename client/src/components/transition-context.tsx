import { createContext, useContext, ReactNode, useRef, useCallback } from "react";
import { SandstormTransitionRef } from "@/components/ui/sandstorm-transition";

interface TransitionContextType {
  sandstormRef: React.RefObject<SandstormTransitionRef>;
  triggerTransition: (onCovered?: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const sandstormRef = useRef<SandstormTransitionRef>(null);

  const triggerTransition = useCallback((onCovered?: () => void) => {
    if (sandstormRef.current) {
      sandstormRef.current.startStorm(() => {
        if (onCovered) {
          onCovered();
        }
      });
    }
  }, []);

  return (
    <TransitionContext.Provider value={{ sandstormRef, triggerTransition }}>
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
