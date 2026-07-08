export function SellerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-lg">
          <p className="text-sm text-zinc-400">Total Sales</p>
          <p className="text-3xl font-bold">124</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <p className="text-sm text-zinc-400">Total Earned</p>
          <p className="text-3xl font-bold">$8,420</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <p className="text-sm text-zinc-400">Active Listings</p>
          <p className="text-3xl font-bold">17</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <p className="text-sm text-zinc-400">Available to Cash Out</p>
          <p className="text-3xl font-bold">$1,240</p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Listings */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Active Listings</h2>
          {/* Map through listings here */}
        </div>

        {/* Orders to Ship */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Orders to Ship</h2>
          <p className="text-red-400">Ship that shit</p>
          {/* Map through orders */}
        </div>
      </div>
    </div>
  );
}
