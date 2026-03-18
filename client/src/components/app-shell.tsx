import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AgeGate } from "@/components/ui/age-gate";
import { useWorldPolicy } from "@/experience/world/WorldProvider";

interface AppShellProps {
  children: ReactNode;
}

function getInitialAgeVerified(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("ageVerified") === "true";
  } catch {
    return false;
  }
}

export function AppShell({ children }: AppShellProps) {
  const { mode, reducedMotion } = useWorldPolicy();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(getInitialAgeVerified);
  const [showAgeGate, setShowAgeGate] = useState(false);

  const cinematic = mode === "cinematic" && !reducedMotion;

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    // Show age gate after loading if not verified
    if (!isAgeVerified) {
      setShowAgeGate(true);
    }
  };

  const handleAgeVerify = () => {
    try {
      window.localStorage.setItem("ageVerified", "true");
    } catch {
      // Continue without persistent storage.
    }
    setIsAgeVerified(true);
    setShowAgeGate(false);
  };

  return (
    <>
      {/* STEP 1: Loading Screen - Shows first */}
      {!isLoaded && (
        <LoadingScreen
          minimumDuration={cinematic ? 2500 : 900}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* STEP 2: Age Gate - Shows after loading IF not verified */}
      {isLoaded && showAgeGate && !isAgeVerified && (
        <AgeGate onVerify={handleAgeVerify} />
      )}

      {/* STEP 3: Main Content - Shows after age verification */}
      {isLoaded && isAgeVerified && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-[100dvh]"
          >
            {children}
          </motion.div>
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
