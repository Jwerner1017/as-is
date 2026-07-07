import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Zap, Flame, Gavel } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

export default function ListingCard({ listing }) {
  const isAuction = listing.selling_format === 'Auction';
  const isLive = listing.selling_format === 'Live';
  const isSold = listing.status === 'sold';
  const isJuiced = listing.juiced;
  const rageReady = isAuction && (listing.bid_count >= 15 || listing.rage_buy_triggered_manually);

  const displayPrice = isAuction ? (listing.current_bid || listing.starting_bid || 0) : listing.price;
  const timeLeft = listing.auction_end ? moment(listing.auction_end).fromNow() : null;
  const mainImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop';

  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <div className={`relative rounded-lg overflow-hidden bg-card border transition-all duration-200 hover:border-primary/50 hover:-translate-y-1 ${isJuiced ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'border-border'} ${isSold ? 'opacity-70' : ''}`}>
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={mainImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isJuiced && (
              <Badge className="bg-yellow-500 text-black text-[10px] font-bold">
                <Zap className="w-3 h-3 mr-0.5" /> JUICED
              </Badge>
            )}
            {isLive && (
              <Badge className="bg-red-600 text-white text-[10px] font-bold animate-pulse">
                ● LIVE
              </Badge>
            )}
            {rageReady && !isSold && (
              <Badge className="bg-red-700 text-white text-[10px] font-bold">
                <Flame className="w-3 h-3 mr-0.5" /> RAGE READY
              </Badge>
            )}
            {isSold && (
              <Badge className="bg-muted text-foreground text-[10px] font-bold">SOLD</Badge>
            )}
          </div>
          {listing.condition && (
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] border-0">
              {listing.condition}
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-foreground truncate">{listing.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className={`text-lg font-bold ${isSold ? 'text-muted-foreground' : 'text-primary'}`}>
                ${displayPrice?.toFixed(2)}
              </p>
              {isSold && listing.final_price && (
                <p className="text-xs text-green-500 font-medium">Sold: ${listing.final_price.toFixed(2)}</p>
              )}
            </div>
            {isAuction && !isSold && (
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Gavel className="w-3 h-3" /> {listing.bid_count || 0} bids
                </p>
                {timeLeft && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {timeLeft}
                  </p>
                )}
              </div>
            )}
          </div>
          {listing.shipping_type === 'Free Shipping' && (
            <p className="text-[10px] text-green-500 font-medium mt-1">Free Shipping</p>
          )}
        </div>
      </div>
    </Link>
  );
}