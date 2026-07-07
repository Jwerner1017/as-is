import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Zap, Flame, Radio, ArrowRight, ShieldAlert, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ListingGrid from '@/components/listings/ListingGrid';
import { CATEGORIES } from '@/lib/categories';
import { motion } from 'framer-motion';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [juicedListings, setJuicedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [all, juiced] = await Promise.all([
          base44.entities.Listing.filter({ status: 'active' }, '-created_date', 20),
          base44.entities.Listing.filter({ status: 'active', juiced: true }, '-created_date', 5)
        ]);
        setListings(all);
        setJuicedListings(juiced);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground tracking-wider">
              AS <span className="text-primary">IS</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-xl mx-auto font-medium">
              What you see is what you get. No refunds. No crying.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link to="/browse">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider px-8">
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" variant="outline" className="border-border hover:bg-muted font-bold uppercase tracking-wider px-8">
                  <Zap className="w-4 h-4 mr-2" />
                  Sell Something
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* As Is Warning Banner */}
      <section className="bg-primary/10 border-y border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-bold">ALL ITEMS SOLD AS IS.</span> No returns. No refunds. No chargebacks. Act like an adult.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Live Now Banner */}
        <Link to="/live">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-red-900/50 to-red-600/20 border border-red-500/30 rounded-lg p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                <Radio className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-foreground">LIVE NOW</h3>
                <p className="text-sm text-muted-foreground">Watch sellers go live. Bid in real-time. Win games.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </Link>

        {/* Juiced Listings */}
        {juicedListings.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="font-display text-2xl text-foreground">JUICED</h2>
              <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Promoted</span>
            </div>
            <ListingGrid listings={juicedListings} loading={false} />
          </section>
        )}

        {/* Categories */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">CATEGORIES</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/browse?category=${encodeURIComponent(cat.name)}`}>
                <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors text-center group">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{cat.subcategories.length} subcategories</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl text-foreground">FRESH DROPS</h2>
            </div>
            <Link to="/browse" className="text-xs text-primary font-bold uppercase tracking-wider hover:underline">
              View All →
            </Link>
          </div>
          <ListingGrid listings={listings} loading={loading} />
        </section>
      </div>
    </div>
  );
}