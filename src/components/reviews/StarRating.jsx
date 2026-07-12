import React, { useState } from 'react';
import { Star } from 'lucide-react';

const SIZES = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };

export function StarRating({ rating = 0, size = 'md', interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  const iconClass = SIZES[size] || SIZES.md;

  if (!interactive) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`${iconClass} ${i <= Math.round(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/40'}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
        >
          <Star
            className={`${SIZES.lg} ${i <= (hover || rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
          />
        </button>
      ))}
    </div>
  );
}