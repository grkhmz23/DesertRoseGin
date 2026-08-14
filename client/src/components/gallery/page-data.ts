import i18n from '@/i18n/config';

export type PageId = "story" | "experience" | "classic" | "store" | "limited" | "cocktails" | "journey";
export type ViewMode = "hero" | "gallery" | "page";

/**
 * THE STORE is the commerce hub. It opens on a category chooser and drills into
 * one of three shelves. GIN intentionally re-sells the same two editions that
 * keep their own cards in "Choose Your Journey" - the duplication is the point:
 * the editions stay visible on the homepage while the store stays complete.
 */
export const STORE_CATEGORIES = ["gin", "sets", "merch"] as const;
export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export const PAGE_ROUTE_MAP: Record<PageId, string> = {
  limited: "/limited",
  classic: "/classic",
  store: "/store",
  cocktails: "/cocktails",
  story: "/story",
  experience: "/experience",
  journey: "/journey",
};

export const getStoreCategoryRoute = (category: StoreCategory): string =>
  `${PAGE_ROUTE_MAP.store}/${category}`;

/** `/store/merch` -> "merch". The bare `/store` hub and anything unknown -> null. */
export const getStoreCategoryFromPath = (pathname: string): StoreCategory | null => {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const prefix = `${PAGE_ROUTE_MAP.store}/`;

  if (!normalizedPath.startsWith(prefix)) return null;

  const segment = normalizedPath.slice(prefix.length).toLowerCase();

  return STORE_CATEGORIES.includes(segment as StoreCategory) ? (segment as StoreCategory) : null;
};

/**
 * `/sets` was the old bundles page. It shipped in newsletters and was indexed,
 * so it keeps working - pointed at the shelf holding exactly what it used to
 * show, rather than dumping visitors on the hub.
 */
export const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  "/sets": `${PAGE_ROUTE_MAP.store}/sets`,
};

export const getLegacyRedirect = (pathname: string): string | null => {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

  return LEGACY_ROUTE_REDIRECTS[normalizedPath.toLowerCase()] ?? null;
};

export interface PageData {
  id: PageId;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  color: string;
  comingSoon: boolean;
  category?: string;
}

// UPDATED: Using compressed jpg images
export const PAGE_THUMBNAILS = {
  story: "/ourstory-cover.jpg",
  experience: "/experience_cover.jpg",
  classic: "/classic-cover.jpg",
  store: "/the-set-cover.webp",
  limited: "/limited-cover.jpg",
  cocktails: "/cocktails-cover.jpg",
  journey: "/journey-cover.webp",
};

// Function to get translated pages - EVENTS REMOVED
export const getPages = (): PageData[] => {
  const t = i18n.t.bind(i18n);

  return [
    {
      id: "limited",
      title: t('products.limited.name'),
      subtitle: t('products.limited.batch'),
      description: t('products.limited.description'),
      thumbnail: PAGE_THUMBNAILS.limited,
      color: "#8B4513",
      comingSoon: false,
      category: "Products",
    },
    {
      id: "classic",
      title: t('products.classic.name'),
      subtitle: t('products.classic.batch'),
      description: t('products.classic.description'),
      thumbnail: PAGE_THUMBNAILS.classic,
      color: "#CD7E31",
      comingSoon: false,
      category: "Products",
    },
    {
      id: "store",
      title: t('store.title'),
      subtitle: t('store.subtitle'),
      description: t('store.description'),
      thumbnail: PAGE_THUMBNAILS.store,
      color: "#B67A45",
      comingSoon: false,
      category: "Products",
    },
    {
      id: "cocktails",
      title: t('cocktails.title'),
      subtitle: t('cocktails.subtitle'),
      description: t('cocktails.description'),
      thumbnail: PAGE_THUMBNAILS.cocktails,
      color: "#CD7E31",
      comingSoon: false,
      category: "Explore",
    },
    {
      id: "story",
      title: t('story.title'),
      subtitle: t('story.subtitle'),
      description: t('story.section1.text'),
      thumbnail: PAGE_THUMBNAILS.story,
      color: "#CD7E31",
      comingSoon: false,
      category: "About",
    },
    {
      id: "experience",
      title: t('experience.title'),
      subtitle: t('experience.subtitle'),
      description: t('experience.section1.text'),
      thumbnail: PAGE_THUMBNAILS.experience,
      color: "#a65d3d",
      comingSoon: false,
      category: "Discover",
    },
    {
      id: "journey",
      title: t('journey.title'),
      subtitle: t('journey.subtitle'),
      description: t('journey.description'),
      thumbnail: PAGE_THUMBNAILS.journey,
      color: "#CD7E31",
      comingSoon: true,
      category: t('journey.category'),
    },
    // EVENTS REMOVED per client request
  ];
};

// Legacy export for compatibility - will update dynamically
export let PAGES = getPages();

// Update pages when language changes
i18n.on('languageChanged', () => {
  PAGES = getPages();
});

export const getPageById = (id: PageId): PageData | undefined => {
  return getPages().find(page => page.id === id);
};

export const getPageRoute = (id: PageId): string => PAGE_ROUTE_MAP[id];

export const getPageIdFromPath = (pathname: string): PageId | null => {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

  const exactMatch = Object.entries(PAGE_ROUTE_MAP).find(
    ([, route]) => route === normalizedPath,
  )?.[0] as PageId | undefined;

  if (exactMatch) return exactMatch;

  // Category shelves live one level deeper (/store/gin), but they are still the
  // store page - without this they would fall through and bounce to the gallery.
  if (getStoreCategoryFromPath(normalizedPath)) return "store";

  return null;
};
