export type SellerLevel = 'new' | 'upcoming' | 'trusted' | 'top';

export type UserRole = 'buyer' | 'seller' | 'both';

export type ModerationLevel = 'relaxed' | 'medium' | 'strict';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  sellerLevel: SellerLevel;
  totalSales: number;
  positiveFeedbackPercentage: number;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Like New' | 'Used' | 'For Parts';
  category: string;
  subcategory?: string;
  images: string[];
  isJuiced: boolean;
  juiceExpiresAt?: string;
  status: 'active' | 'sold' | 'ended';
  format: 'buy_it_now' | 'auction' | 'live';
  createdAt: string;
}

export interface RageBuySession {
  listingId: string;
  currentHighestBid: number;
  rageBuyPrice: number;
  allMinePrice: number;
  isActive: boolean;
  countdownStartedAt?: string;
  triggeredBy: 'auto' | 'seller';
}

export interface LiveStream {
  id: string;
  sellerId: string;
  title: string;
  description?: string;
  isActive: boolean;
  viewerCount: number;
  moderationLevel: ModerationLevel;
  startedAt: string;
  endedAt?: string;
}

export interface JuiceActivation {
  listingId: string;
  sellerId: string;
  activatedAt: string;
  expiresAt: string;
}
