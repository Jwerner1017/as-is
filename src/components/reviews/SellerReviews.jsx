import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { StarRating } from '@/components/reviews/StarRating';
import { MessageSquare, Loader2 } from 'lucide-react';
import moment from 'moment';

export default function SellerReviews({ sellerId, sellerName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    setLoading(true);
    base44.entities.Review.filter({ seller_id: sellerId }, '-created_date', 20)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading reviews…
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="font-display text-lg text-foreground">SELLER REVIEWS</h3>
        <span className="text-xs text-muted-foreground ml-auto">{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium text-foreground">{review.buyer_name || 'Anonymous Buyer'}</p>
              <span className="text-xs text-muted-foreground">{moment(review.created_date).fromNow()}</span>
            </div>
            <div className="mb-2">
              <StarRating rating={review.rating || 0} size="sm" />
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{review.comment}</p>
            )}
            {review.listing_title && (
              <p className="text-xs text-muted-foreground/70 mt-2 italic">on "{review.listing_title}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}