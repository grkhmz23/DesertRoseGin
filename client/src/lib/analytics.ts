export const COOKIE_CONSENT_KEY = "desert-rose-cookie-consent";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    trackEvent?: (eventName: string, payload?: Record<string, unknown>) => void;
  }
}

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getDefaultConsentState(): ConsentState {
  return { ...DEFAULT_CONSENT };
}

export function getStoredConsentState(): ConsentState | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ConsentState>;

    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function saveConsentState(state: Omit<ConsentState, "updatedAt"> | ConsentState) {
  if (!isBrowser()) return;

  const nextState: ConsentState = {
    necessary: true,
    analytics: !!state.analytics,
    marketing: !!state.marketing,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(nextState));
  applyConsentState(nextState);
}

export function applyConsentState(state: Omit<ConsentState, "updatedAt"> | ConsentState) {
  if (!isBrowser()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    analytics_consent: state.analytics ? "granted" : "denied",
    marketing_consent: state.marketing ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
    functionality_storage: "granted",
    personalization_storage: state.marketing ? "granted" : "denied",
    security_storage: "granted",
  });
}

export function initializeConsentState() {
  const storedConsent = getStoredConsentState();
  applyConsentState(storedConsent ?? getDefaultConsentState());
}

export function trackEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (!isBrowser()) return;

  if (typeof window.trackEvent === "function") {
    window.trackEvent(eventName, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...payload,
  });
}

export function trackPageView(pathname: string) {
  trackEvent("page_view", {
    page_path: pathname,
    page_title: typeof document !== "undefined" ? document.title : "",
  });
}

export function trackContactClick(contactType: string, destination: string) {
  trackEvent("contact_click", {
    contact_type: contactType,
    destination,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}
