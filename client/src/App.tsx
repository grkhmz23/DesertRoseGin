import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";
import { TransitionProvider } from "@/components/transition-context"; 
import { CartProvider, CartDrawer, CartIcon } from "@/components/cart";
import { MusicProvider, MusicPlayer } from "@/components/music";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { DesertRoseGalleryLanding } from "@/pages/desert-rose-gallery-landing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DesertRoseGalleryLanding} />
      <Route path="/:slug" component={DesertRoseGalleryLanding} />
      <Route component={DesertRoseGalleryLanding} />
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
        <CartProvider>
          <MusicProvider>
            <Toaster />
            <TransitionProvider>
              <AppContent />
            </TransitionProvider>
            <CartIcon />
            <CartDrawer />
            <MusicPlayer />
            <CookieBanner />
          </MusicProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
