import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { TransitionProvider } from "@/components/transition-context"; 

// UPDATED: Import new gallery landing instead of old landing
import { DesertRoseGalleryLanding } from "@/pages/desert-rose-gallery-landing";
import CocktailsPage from "@/pages/cocktails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* UPDATED: Use new gallery landing */}
      <Route path="/" component={DesertRoseGalleryLanding} />
      <Route path="/cocktails" component={CocktailsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <AppShell>
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