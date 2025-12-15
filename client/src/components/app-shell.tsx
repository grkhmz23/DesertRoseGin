import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { DesertMirageTransition } from "@/components/ui/desert-mirage-transition";
import { TransitionProvider, useTransition } from "@/components/transition-context";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AgeGate } from "@/components/ui/age-gate";

interface AppShellProps {
  children: ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const { transitionRef } = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Premium Loading Screen */}
      <LoadingScreen 
        minimumDuration={2500}
        onComplete={() => setIsLoaded(true)}
      />

      {/* Premium Magnetic Cursor */}
      <MagneticCursor />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
      
      {/* Desert Mirage Transition */}
      <DesertMirageTransition ref={transitionRef} />

      {/* Subtle noise overlay for texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <TransitionProvider>
      <AgeGate>
        <AppShellContent>
          {children}
        </AppShellContent>
      </AgeGate>
    </TransitionProvider>
  );
}
