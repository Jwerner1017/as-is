import React from 'react';
import ListingCard from '@/components/listings/ListingCard';

export default function ListingGrid({ listings, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-card border border-border animate-pulse">
            <div className="aspect-square bg-muted" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-5 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!listings?.length) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-display text-muted-foreground">NOTHING HERE</p>
        <p className="text-sm text-muted-foreground mt-2">Looks like this section is empty. Be the first to list something.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}