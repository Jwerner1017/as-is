export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  finalPrice: number;
  platformFee: number;        // 2%
  sellerPayoutAmount: number;
  status: 'pending' | 'completed' | 'refunded';
  payoutStatus: PayoutStatus;
  trackingNumber?: string;
  deliveredAt?: string;
  createdAt: string;
}
