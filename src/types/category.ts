export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string; // For subcategories
  level: 1 | 2 | 3;
}

export const MAIN_CATEGORIES = [
  { id: 'electronics', name: 'Electronics', slug: 'electronics' },
  { id: 'fashion', name: 'Fashion & Apparel', slug: 'fashion' },
  { id: 'home-garden', name: 'Home & Garden', slug: 'home-garden' },
  { id: 'automotive', name: 'Automotive', slug: 'automotive' },
  { id: 'sports', name: 'Sports & Outdoors', slug: 'sports' },
  { id: 'collectibles', name: 'Collectibles', slug: 'collectibles' },
  { id: 'tools', name: 'Tools & Equipment', slug: 'tools' },
  { id: 'beauty', name: 'Beauty & Personal Wellness', slug: 'beauty' },
  { id: 'toys', name: 'Toys & Hobbies', slug: 'toys' },
  { id: 'misc', name: 'Miscellaneous', slug: 'misc' },
];
