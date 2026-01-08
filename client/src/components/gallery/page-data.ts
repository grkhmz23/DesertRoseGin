import i18n from '@/i18n/config';

export type PageId = "story" | "experience" | "classic" | "limited" | "cocktails" | "events";
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

export const PAGE_THUMBNAILS = {
  story: "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414898-64867308-544x488x551x827x6x115-section-02-image.jpg",
  experience: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800",
  classic: "/assets/bottles/bottle-classic.png",
  limited: "/assets/bottles/bottle-limited.png",
  cocktails: "/assets/bottles/bespoke-beverages.png",
  events: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
};

// Function to get translated pages
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
    {
      id: "events",
      title: t('events.title'),
      subtitle: t('events.subtitle'),
      description: t('events.description'),
      thumbnail: PAGE_THUMBNAILS.events,
      color: "#a65d3d",
      comingSoon: true,
      category: "Connect",
    },
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