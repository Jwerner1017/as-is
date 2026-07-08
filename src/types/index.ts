export type UserRole = 'buyer' | 'seller' | 'both';

export type SellerLevel = 'new' | 'upcoming' | 'trusted' | 'top';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  sellerLevel: SellerLevel;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  isJuiced: boolean;
  juiceExpiresAt?: string;
  status: 'active' | 'sold' | 'ended';
  createdAt: string;
}

export interface RageBuySession {
  listingId: string;
  currentBid: number;
  rageBuyPrice: number;
  allMinePrice: number;
  isActive: boolean;
  countdownStartedAt?: string;
}
