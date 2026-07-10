import { SellerLevelBadge } from '../seller/SellerLevelBadge';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  format: 'buy_it_now' | 'auction' | 'live';
  sellerLevel?: 'new' | 'upcoming' | 'trusted' | 'top';
  isJuiced?: boolean;
  onClick?: () => void;
}

export function ListingCard({
  title,
  price,
  image,
  condition,
  format,
  sellerLevel,
  isJuiced = false,
  onClick,
}: ListingCardProps) {
  const formatLabel = {
    buy_it_now: 'Buy It Now',
    auction: 'Auction',
    live: 'Live',
  };

  const formatColor = {
    buy_it_now: 'bg-green-600',
    auction: 'bg-blue-600',
    live: 'bg-red-600',
  };

  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer 
                 hover:border-zinc-700 transition-all duration-200 group"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {/* Format Badge */}
          <span className={`${formatColor[format]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {formatLabel[format]}
          </span>

          {/* Juiced Badge */}
          {isJuiced && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full w-fit">
              JUICE
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-black/80 px-3 py-1 rounded-lg">
          <span className="text-white font-bold text-lg">${price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between">
          {/* Condition */}
          <span className="text-sm text-zinc-400">{condition}</span>

          {/* Seller Level */}
          {sellerLevel && (
            <SellerLevelBadge level={sellerLevel} />
          )}
        </div>
      </div>
    </div>
  );
}
