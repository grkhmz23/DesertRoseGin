import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { TransitionProvider, useTransition } from "@/components/transition-context"; 
import { DesertMirageTransition } from "@/components/ui/desert-mirage-transition"; 
import { CustomCursor } from "@/components/ui/custom-cursor"; 
import LandingPage from "@/pages/landing";
import CocktailsPage from "@/pages/cocktails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/cocktails" component={CocktailsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { transitionRef } = useTransition();
  return (
    <AppShell>
      <DesertMirageTransition ref={transitionRef} />
      <CustomCursor />
      <Router />
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <TransitionProvider>
          <AppContent />
        </TransitionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
