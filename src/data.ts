import { GalleryFilter, MediaItem, Package, WeddingStory } from './types';

export const GALLERY_ITEMS: MediaItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070', type: 'image', category: GalleryFilter.WEDDINGS, title: 'The Royal Entrance', aspect: 'landscape' },
  { id: '2', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070', type: 'image', category: GalleryFilter.PRE_WEDDING, title: 'Golden Hour Embrace', aspect: 'portrait' },
  { id: '3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2076', type: 'image', category: GalleryFilter.PORTRAITS, title: 'Emotional Close-up', aspect: 'portrait' },
  { id: '4', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069', type: 'image', category: GalleryFilter.WEDDINGS, title: 'Eternal Vows', aspect: 'landscape' },
  { id: '5', url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-walking-in-a-field-34440-large.mp4', type: 'video', category: GalleryFilter.OTHER, title: 'Fields of Forever', aspect: 'reel' },
  { id: '6', url: 'https://images.unsplash.com/photo-1465495910483-0490b39527ec?q=80&w=2070', type: 'image', category: GalleryFilter.WEDDINGS, title: 'Dance Floor Joy', aspect: 'landscape' },
  { id: '7', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070', type: 'image', category: GalleryFilter.PORTRAITS, title: 'The Groom', aspect: 'portrait' },
  { id: '8', url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-bride-and-groom-34437-large.mp4', type: 'video', category: GalleryFilter.RITUALS, title: 'Slow Motion Love', aspect: 'reel' },
  { id: '9', url: 'https://assets.mixkit.co/videos/preview/mixkit-groom-putting-the-ring-on-the-brides-finger-34438-large.mp4', type: 'video', category: GalleryFilter.RITUALS, title: 'The Vow', aspect: 'reel' },
];

export const PACKAGES: Package[] = [
  {
    id: 'p1',
    name: 'Silver Collection',
    duration: '1 Full Day',
    deliverables: ['300+ Processed Photos', '1 Cinematic Highlights Film (5-7m)', 'Online Gallery (1 Year)'],
    highlights: ['Traditional Coverage', 'Single Photographer', 'USB Delivery'],
  },
  {
    id: 'p2',
    name: 'Gold Collection',
    duration: '2 Full Days',
    deliverables: ['600+ Processed Photos', '1 Full Length Film (20-30m)', '1 Cinematic Highlights Film (7-10m)', 'Premium Coffee Table Book'],
    highlights: ['Editorial Style', 'Dual Photographer Team', 'Drone Coverage Included'],
    isPopular: true,
  },
  {
    id: 'p3',
    name: 'Platinum Legacy',
    duration: 'Multi-Day Events',
    deliverables: ['1000+ Processed Photos', 'Multi-Part Documentary Series', '2 Premium Wedding Albums', 'Same-Day Edit Film'],
    highlights: ['The Master Team Coverage', 'Unlimited Coverage', '4K Cinema Standards'],
  },
];

export const STORIES: WeddingStory[] = [
  {
    id: 's1',
    slug: 'arjun-ananya-udaipur',
    couple: 'Arjun & Ananya',
    location: 'Udaipur, Rajasthan',
    date: 'October 2023',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070',
    intro: 'A celebration of love amidst the regal charm of Lake Pichola. A three-day journey of traditions and cinematic moments.',
    gallery: GALLERY_ITEMS.slice(0, 4),
  },
  {
    id: 's2',
    slug: 'rohan-priya-goa',
    couple: 'Rohan & Priya',
    location: 'North Goa',
    date: 'December 2023',
    heroImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2076',
    intro: 'Breezy sun-kissed rituals on the sands of Goa. A modern union blending beach aesthetics with deep cultural roots.',
    gallery: GALLERY_ITEMS.slice(4, 8),
  }
];