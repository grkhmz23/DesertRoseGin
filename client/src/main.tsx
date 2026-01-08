import './i18n/config';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./experience/world/world.css";
import { WorldProvider } from "@/experience/world/WorldProvider";

createRoot(document.getElementById("root")!).render(
  <WorldProvider>
    <App />
  </WorldProvider>
);
