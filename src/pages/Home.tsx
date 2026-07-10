import { useState } from 'react';
import { ListingCard } from '../components/listing/ListingCard';

export default function Home() {
  const [sortBy, setSortBy] = useState('newest');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Browse</h1>
        
        {/* Sort Dropdown */}
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="ending-soon">Ending Soonest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Map through listings here */}
        {/* Example: <ListingCard ... /> */}
      </div>
    </div>
  );
}
