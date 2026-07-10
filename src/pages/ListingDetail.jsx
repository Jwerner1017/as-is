import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Clock, Gavel, Flame, Zap, ShieldAlert, Truck, Crown, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';

export default function ListingDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(null); // 'buy_now' | 'rage_buy' | 'all_mine' | 'bid'
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [l, u] = await Promise.all([
          base44.entities.Listing.get(id),
          base44.auth.me()
        ]);
        setListing(l);
        setUser(u);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      toast({ title: "Payment Successful!", description: "Your purchase is complete. Sold As Is." });
    } else if (params.get('payment') === 'cancelled') {
      toast({ title: "Payment Cancelled", description: "Your purchase was not completed.", variant: "destructive" });
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-3">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-12 bg-muted rounded w-1/3" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl text-muted-foreground">LISTING NOT FOUND</h2>
        <p className="text-muted-foreground mt-2">It might've been sold, removed, or never existed.</p>
        <Link to="/browse"><Button className="mt-6">Go Back</Button></Link>
      </div>
    );
  }

  const isAuction = listing.selling_format === 'Auction';
  const isSold = listing.status === 'sold';
  const displayPrice = isAuction ? (listing.current_bid || listing.starting_bid || 0) : listing.price;
  const rageReady = isAuction && (listing.bid_count >= 15 || listing.rage_buy_triggered_manually) && !isSold;
  const rageBuyPrice = (displayPrice * 1.20).toFixed(2);
  const allMinePrice = (displayPrice * 1.25).toFixed(2);
  const images = listing.images?.length ? listing.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop'];
  const minBid = displayPrice + 1;

  const handleAction = async (type) => {
    setShowConfirm(null);

    if (type === 'bid') {
      const finalPrice = parseFloat(bidAmount);
      await base44.entities.Bid.create({
        listing_id: listing.id,
        bidder_id: user?.id,
        bidder_name: user?.full_name || 'Anonymous',
        amount: finalPrice,
        bid_type: 'normal',
        timestamp: new Date().toISOString()
      });
      await base44.entities.Listing.update(listing.id, {
        current_bid: finalPrice,
        bid_count: (listing.bid_count || 0) + 1,
        highest_bidder_id: user?.id,
        highest_bidder_name: user?.full_name || 'Anonymous'
      });
      const updated = await base44.entities.Listing.get(id);
      setListing(updated);
      setBidAmount('');
      toast({ title: "Bid Placed!", description: `Your bid of $${finalPrice.toFixed(2)} has been placed.` });
      return;
    }

    if (window.self !== window.top) {
      toast({ title: "Cannot checkout", description: "Checkout works only from a published app.", variant: "destructive" });
      return;
    }

    try {
      const res = await base44.functions.invoke('stripe-checkout', {
        listing_id: listing.id,
        buyer_id: user?.id,
        buyer_name: user?.full_name || 'Anonymous',
        purchase_type: type
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      toast({ title: "Payment Error", description: e.response?.data?.error || e.message, variant: "destructive" });
    }
  };

  const confirmMessages = {
    buy_now: { title: "Purchase Complete", desc: `You now own this item As Is for $${displayPrice?.toFixed(2)}. Don't come crying if it's broken.` },
    rage_buy: { title: "RAGE BUY", desc: `You just hit RAGE BUY and paid $${rageBuyPrice}. This item is now yours. No refunds. No take-backs.` },
    all_mine: { title: "ALL MINE", desc: `ALL MINE successful! You just stole that shit for $${allMinePrice}. Enjoy it.` },
    bid: { title: "Place Bid", desc: `You're about to bid $${bidAmount || '0'} on this item. Once placed, your bid is binding.` }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border">
            <img src={images[selectedImage]} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded overflow-hidden border-2 shrink-0 ${i === selectedImage ? 'border-primary' : 'border-border'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge variant="outline" className="text-[10px]">{listing.category}</Badge>
                {listing.subcategory && <Badge variant="outline" className="text-[10px]">{listing.subcategory}</Badge>}
                <Badge variant="outline" className="text-[10px]">{listing.condition}</Badge>
                <Badge variant="outline" className="text-[10px]">{listing.selling_format}</Badge>
                {listing.is_replica && <Badge className="bg-yellow-600 text-white text-[10px]">REPLICA</Badge>}
                {listing.juiced && <Badge className="bg-yellow-500 text-black text-[10px]"><Zap className="w-3 h-3 mr-0.5" /> JUICED</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{listing.title}</h1>
            </div>
          </div>

          {/* Price */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-bold ${isSold ? 'text-muted-foreground' : 'text-primary'}`}>
                ${displayPrice?.toFixed(2)}
              </span>
              {isAuction && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Gavel className="w-4 h-4" /> {listing.bid_count || 0} bids
                </span>
              )}
              {isSold && <Badge className="bg-muted text-foreground">SOLD for ${listing.final_price?.toFixed(2)}</Badge>}
            </div>
            {isAuction && listing.auction_end && !isSold && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Ends {moment(listing.auction_end).fromNow()}
              </p>
            )}
          </div>

          {/* Actions */}
          {!isSold && (
            <div className="space-y-2">
              {listing.selling_format === 'Buy It Now' && (
                <Button onClick={() => setShowConfirm('buy_now')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase tracking-wider h-14">
                  BUY IT NOW — ${listing.price?.toFixed(2)}
                </Button>
              )}

              {isAuction && (
                <>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={minBid}
                      step="0.01"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min bid: $${minBid.toFixed(2)}`}
                      className="flex-1 bg-card border-border h-14 text-lg"
                    />
                    <Button
                      onClick={() => { if (parseFloat(bidAmount) >= minBid) setShowConfirm('bid'); }}
                      disabled={!bidAmount || parseFloat(bidAmount) < minBid}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase tracking-wider h-14 px-6"
                    >
                      <Gavel className="w-5 h-5 mr-1" /> PLACE BID
                    </Button>
                  </div>

                  {rageReady && (
                    <Button
                      onClick={() => setShowConfirm('rage_buy')}
                      className="w-full bg-red-700 hover:bg-red-600 text-white font-bold text-lg uppercase tracking-wider h-14 rage-pulse"
                    >
                      <Flame className="w-5 h-5 mr-2" />
                      RAGE BUY — ${rageBuyPrice}
                    </Button>
                  )}

                  {listing.all_mine_active && (
                    <Button
                      onClick={() => setShowConfirm('all_mine')}
                      className="w-full bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white font-bold text-lg uppercase tracking-wider h-14"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      ALL MINE — ${allMinePrice}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Seller info */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seller</p>
            <p className="font-medium text-foreground">{listing.seller_name || 'Unknown Seller'}</p>
          </div>

          {/* Shipping */}
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Truck className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{listing.shipping_type}</p>
              {listing.shipping_type !== 'Free Shipping' && listing.shipping_cost && (
                <p className="text-xs text-muted-foreground">${listing.shipping_cost?.toFixed(2)}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-2">DESCRIPTION</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{listing.description}</p>
          </div>

          {/* As Is Warning */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-primary">SOLD AS IS</p>
              <p className="text-xs text-muted-foreground mt-1">
                All items sold strictly As Is, Where Is, With All Faults. No returns, refunds, or chargebacks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!showConfirm} onOpenChange={() => setShowConfirm(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground">
              {confirmMessages[showConfirm]?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {confirmMessages[showConfirm]?.desc}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirm(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => handleAction(showConfirm)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
              {showConfirm === 'bid' ? 'Place Bid' : 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}