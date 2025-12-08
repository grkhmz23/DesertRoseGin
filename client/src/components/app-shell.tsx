import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation, Router, BaseLocationHook } from "wouter";
import { motion } from "framer-motion";
import { DesertWindTransition } from "@/components/ui/desert-wind-transition";
import { TransitionProvider, useTransition } from "@/components/transition-context";

interface AppShellProps {
  children: ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const { isTransitioning } = useTransition();

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
      <DesertWindTransition active={isTransitioning} />
    </>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <TransitionProvider transitionDuration={1200}>
      <AppShellContent>
        {children}
      </AppShellContent>
    </TransitionProvider>
  );
}
