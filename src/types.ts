export enum GalleryFilter {
  ALL = 'All',
  WEDDINGS = 'Weddings',
  PRE_WEDDING = 'Pre-Wedding',
  RITUALS = 'Rituals',
  PORTRAITS = 'Portraits',
  OTHER = 'Other'
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  category: GalleryFilter;
  title: string;
  aspect: 'portrait' | 'landscape' | 'reel';
}

export interface Package {
  id: string;
  name: string;
  duration: string;
  deliverables: string[];
  highlights: string[];
  price?: string;
  isPopular?: boolean;
}

export interface WeddingStory {
  id: string;
  slug: string;
  couple: string;
  location: string;
  date: string;
  heroImage: string;
  gallery: MediaItem[];
  intro: string;
}