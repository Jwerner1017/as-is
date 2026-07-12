import React from 'react';
import { ShieldAlert, Flame, Crown, Radio, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-foreground mb-6">ABOUT AS IS</h1>

      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          AS IS is a no-nonsense online marketplace where buyers and sellers come together to trade
          items exactly as they are — no fluff, no false promises, no safety net. Every listing is sold
          strictly As Is, Where Is, With All Faults. What you see is what you get, and once a sale is
          final, it's final. There are no returns, no refunds, and no chargebacks. We built this platform
          for people who are tired of the polished, over-curated shopping experiences and just want
          straight-up deals on real items.
        </p>

        <p>
          The platform is designed for two kinds of people. For buyers, AS IS offers a raw, unfiltered
          marketplace where you can snag everything from electronics and collectibles to oddities and
          one-of-a-kind finds — often at prices you won't see anywhere else because sellers aren't
          burdened with return policies or buyer protection overhead. For sellers, AS IS provides a
          fast, frictionless way to move inventory: list it, sell it, ship it, done. Sellers can choose
          between Buy It Now, Auction, and Live selling formats, with features like Rage Buy and All Mine
          that add urgency and excitement to the bidding process. Live streaming lets sellers showcase
          items in real time, building trust and driving sales through direct interaction with buyers.
        </p>

        <p>
          AS IS is built and maintained by a small, independent team of developers and marketplace
          enthusiasts who believe that commerce doesn't have to be complicated. We handle the platform
          infrastructure — payments through Stripe, shipping through Shippo, and seller payouts — so
          that our users can focus on what matters: buying and selling. We're committed to keeping the
          platform lean, transparent, and brutally honest. If something's broken, we'll tell you. If a
          deal goes south, that's on you — but the platform will always be here to facilitate the next
          one. Welcome to AS IS. No refunds. No crying. Just deals.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider">Rage Buy</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider">All Mine</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Radio className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider">Live Selling</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider">Fast Shipping</p>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-10 flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-primary shrink-0" />
        <div>
          <p className="font-display text-xl text-primary">SOLD AS IS</p>
          <p className="text-sm text-muted-foreground mt-1">
            All items sold on this platform are sold strictly As Is, Where Is, With All Faults.
            No returns, refunds, or chargebacks. By using AS IS, you accept these terms.
          </p>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link to="/browse"><Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">Start Browsing</Button></Link>
      </div>
    </div>
  );
}