// Page Data Structure for Card Gallery System

export type PageId = "story" | "experience" | "classic" | "limited" | "cocktails" | "events";

export type ViewMode = "hero" | "gallery" | "page";

export interface PageData {
  id: PageId;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  color: string; // Accent color for the card
  comingSoon: boolean;
  category?: string;
}

// Import paths - these will be imported from your actual files
// Thumbnails for the cards
export const PAGE_THUMBNAILS = {
  story: "https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414898-64867308-544x488x551x827x6x115-section-02-image.jpg",
  experience: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800",
  classic: "/assets/bottles/2025-05-27_Desert_Rose_-_Mockup_Bottiglia_500ml_1765299128312.webp",
  limited: "/assets/bottles/bottle-limited.webp",
  cocktails: "/assets/cocktails/Desert_Rose_Gin_Tonic_LR_RGB_1765314255796.webp",
  events: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", // Event/partnership placeholder
};

// Define all pages
export const PAGES: PageData[] = [
  {
    id: "story",
    title: "Our Story",
    subtitle: "Swiss Craftsmanship",
    description: "The Desert Rose Gin Co. blends Swiss precision with atypical botanicals from distant worlds.",
    thumbnail: PAGE_THUMBNAILS.story,
    color: "#CD7E31",
    comingSoon: false,
    category: "About",
  },
  {
    id: "experience",
    title: "The Experience",
    subtitle: "Saharan Inspired",
    description: "An opulent escape infused with desert botanicals, crafted through small-batch distillation.",
    thumbnail: PAGE_THUMBNAILS.experience,
    color: "#a65d3d",
    comingSoon: false,
    category: "Discover",
  },
  {
    id: "classic",
    title: "Classic Edition",
    subtitle: "Small Batch Gin",
    description: "Handcrafted gin with notes of sun-baked citrus, sage, and hidden floral sweetness.",
    thumbnail: PAGE_THUMBNAILS.classic,
    color: "#CD7E31",
    comingSoon: false,
    category: "Products",
  },
  {
    id: "limited",
    title: "Limited Edition",
    subtitle: "London Dry Gin",
    description: "Desert-inspired with Date, Darjeeling tea, Lemon & Orange for an intense, warm finish.",
    thumbnail: PAGE_THUMBNAILS.limited,
    color: "#8B4513",
    comingSoon: false,
    category: "Products",
  },
  {
    id: "cocktails",
    title: "Signature Cocktails",
    subtitle: "Handcrafted Serves",
    description: "Explore our curated collection of cocktails inspired by the Saharan desert.",
    thumbnail: PAGE_THUMBNAILS.cocktails,
    color: "#CD7E31",
    comingSoon: false,
    category: "Explore",
  },
  {
    id: "events",
    title: "Events & Partnership",
    subtitle: "Join the Journey",
    description: "Exclusive events, collaborations, and partnership opportunities.",
    thumbnail: PAGE_THUMBNAILS.events,
    color: "#a65d3d",
    comingSoon: true,
    category: "Connect",
  },
];

// Helper functions
export const getPageById = (id: PageId): PageData | undefined => {
  return PAGES.find(page => page.id === id);
};

export const getAvailablePages = (): PageData[] => {
  return PAGES.filter(page => !page.comingSoon);
};

export const getComingSoonPages = (): PageData[] => {
  return PAGES.filter(page => page.comingSoon);
};