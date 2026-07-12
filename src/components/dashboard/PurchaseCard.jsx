import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/reviews/StarRating';
import { CheckCircle, Star } from 'lucide-react';

export default function PurchaseCard({ order, review, onMarkDelivered, onReview }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded bg-muted overflow-hidden shrink-0">
          <img src={order.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{order.listing_title}</p>
          <p className="text-sm text-primary font-bold">${order.amount?.toFixed(2)}</p>
        </div>
        <Badge variant="outline" className="text-[10px] capitalize">{order.status?.replace(/_/g, ' ')}</Badge>
      </div>
      {order.status === 'shipped' && (
        <Button onClick={() => onMarkDelivered(order.id)} variant="outline" className="w-full mt-3 text-xs uppercase tracking-wider">
          <CheckCircle className="w-3 h-3 mr-1" /> Mark Delivered
        </Button>
      )}
      {order.status === 'delivered' && !review && (
        <Button onClick={() => onReview(order)} className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider font-bold">
          <Star className="w-3 h-3 mr-1" /> Leave Review
        </Button>
      )}
      {order.status === 'delivered' && review && (
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border">
          <StarRating rating={review.rating || 0} size="sm" />
          <span className="text-xs text-muted-foreground">Reviewed</span>
        </div>
      )}
    </div>
  );
}