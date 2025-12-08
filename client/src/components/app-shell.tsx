import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SandstormTransition } from "@/components/ui/sandstorm-transition";
import { TransitionProvider, useTransition } from "@/components/transition-context";

interface AppShellProps {
  children: ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const { sandstormRef } = useTransition();

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
      <SandstormTransition ref={sandstormRef} />
    </>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <TransitionProvider>
      <AppShellContent>
        {children}
      </AppShellContent>
    </TransitionProvider>
  );
}
