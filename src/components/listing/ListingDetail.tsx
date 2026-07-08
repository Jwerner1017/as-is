import { RageBuyButton } from '../ragebuy/RageBuyButton';
import { JuiceButton } from '../juice/JuiceButton';
import { SellerLevelBadge } from '../seller/SellerLevelBadge';

interface ListingDetailProps {
  listing: any; // Replace with proper Listing type later
  currentUserId?: string;
}

export function ListingDetail({ listing, currentUserId }: ListingDetailProps) {
  const isOwner = currentUserId === listing.sellerId;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <img 
            src={listing.images?.[0]} 
            alt={listing.title}
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <SellerLevelBadge level={listing.sellerLevel} />
              {listing.isJuiced && (
                <span className="text-yellow-400 text-sm">Juiced</span>
              )}
            </div>
          </div>

          <div className="text-4xl font-bold">${listing.price}</div>

          <div className="prose prose-invert">
            <p>{listing.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {!isOwner && listing.format === 'buy_it_now' && (
              <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold">
                BUY IT NOW
              </button>
            )}

            {!isOwner && listing.format === 'live' && (
              <RageBuyButton 
                onClick={() => {}} 
                isActive={false} 
                price={listing.price} 
              />
            )}

            {isOwner && (
              <JuiceButton 
                onClick={() => {}} 
                isJuiced={listing.isJuiced} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
