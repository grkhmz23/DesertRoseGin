import { createContext, useContext, ReactNode, useRef, useCallback, useState } from "react";
import { DesertMirageTransitionRef } from "@/components/ui/desert-mirage-transition";

interface TransitionContextType {
  transitionRef: React.RefObject<DesertMirageTransitionRef>;
  triggerTransition: (onCovered?: () => void) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

interface TransitionProviderProps {
  children: ReactNode;
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const transitionRef = useRef<DesertMirageTransitionRef>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback((onCovered?: () => void) => {
    console.log('✨ [TransitionProvider] triggerTransition called, isTransitioning:', isTransitioning);
    if (transitionRef.current && !isTransitioning) {
      console.log('✨ [TransitionProvider] Starting Desert Mirage transition');
      setIsTransitioning(true);
      transitionRef.current.startTransition(
        () => {
          console.log('✨ [TransitionProvider] Transition at midpoint, executing callback');
          if (onCovered) {
            onCovered();
          }
        },
        () => {
          console.log('✨ [TransitionProvider] Transition complete, resetting isTransitioning');
          setIsTransitioning(false);
        }
      );
    } else {
      console.log('✨ [TransitionProvider] Transition blocked:', !transitionRef.current ? 'No ref' : 'Already transitioning');
    }
  }, [isTransitioning]);

  return (
    <TransitionContext.Provider value={{ transitionRef, triggerTransition, isTransitioning }}>
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
