import './i18n/config';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./experience/world/world.css";
import { WorldProvider } from "@/experience/world/WorldProvider";

const cloudflareAnalyticsToken = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN?.trim();

if (typeof document !== "undefined" && cloudflareAnalyticsToken) {
  const existingBeacon = document.querySelector('script[data-cf-beacon]');

  if (!existingBeacon) {
    const beaconScript = document.createElement("script");
    beaconScript.defer = true;
    beaconScript.src = "https://static.cloudflareinsights.com/beacon.min.js";
    beaconScript.setAttribute(
      "data-cf-beacon",
      JSON.stringify({ token: cloudflareAnalyticsToken }),
    );
    document.head.appendChild(beaconScript);
  }
}

createRoot(document.getElementById("root")!).render(
  <WorldProvider>
    <App />
  </WorldProvider>
);
