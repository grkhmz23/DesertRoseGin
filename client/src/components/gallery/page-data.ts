import i18n from '@/i18n/config';

export type PageId = "story" | "experience" | "classic" | "limited" | "cocktails";
export type ViewMode = "hero" | "gallery" | "page";

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
  limited: "/limited-cover.jpg",
  cocktails: "/cocktails-cover.jpg",
};

// Function to get translated pages - EVENTS REMOVED
export const getPages = (): PageData[] => {
  const t = i18n.t.bind(i18n);

  return [
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
      id: "cocktails",
      title: t('cocktails.title'),
      subtitle: t('cocktails.subtitle'),
      description: t('cocktails.description'),
      thumbnail: PAGE_THUMBNAILS.cocktails,
      color: "#CD7E31",
      comingSoon: false,
      category: "Explore",
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
