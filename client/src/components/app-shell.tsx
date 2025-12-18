import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { DesertMirageTransition } from "@/components/ui/desert-mirage-transition";
import { TransitionProvider, useTransition } from "@/components/transition-context";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AgeGate } from "@/components/ui/age-gate";
import { WorldProvider, useWorldPolicy } from "@/experience/world/WorldProvider";

interface AppShellProps {
  children: ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const { transitionRef } = useTransition();
  const { mode, reducedMotion } = useWorldPolicy();
  const [isLoaded, setIsLoaded] = useState(false);

  const cinematic = mode === "cinematic" && !reducedMotion;

  return (
    <>
      {/* FIX: Render AgeGate immediately (Z-Index 10000 ensures it stays on top) */}
      <AgeGate />

      {/* Loading Screen runs underneath or after, depending on verification */}
      {!isLoaded && (
        <LoadingScreen
          minimumDuration={cinematic ? 2500 : 900}
          onComplete={() => setIsLoaded(true)}
        />
      )}

      {/* Main App Content - Only visible after loading */}
      {isLoaded && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>

          <DesertMirageTransition ref={transitionRef} />

          {cinematic ? (
            <div
              className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          ) : null}
        </>
      )}
    </>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <TransitionProvider>
      <WorldProvider>
        <AppShellContent>{children}</AppShellContent>
      </WorldProvider>
    </TransitionProvider>
  );
}