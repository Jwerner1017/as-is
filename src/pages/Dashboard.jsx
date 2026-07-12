import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Package, Truck, DollarSign, Trophy, BarChart3, Radio, Plus, ChevronRight, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import StripeOnboarding from '@/components/seller/StripeOnboarding';
import PrintLabelDialog from '@/components/shipping/PrintLabelDialog';
import ShipFromAddress from '@/components/shipping/ShipFromAddress';
import ReviewDialog from '@/components/reviews/ReviewDialog';
import PurchaseCard from '@/components/dashboard/PurchaseCard';
import { StarRating } from '@/components/reviews/StarRating';

const LEVEL_COLORS = {
  'New': 'bg-muted text-foreground',
  'Up & Coming': 'bg-blue-900 text-blue-200',
  'Trusted Seller': 'bg-emerald-900 text-emerald-200',
  'Top Seller': 'bg-yellow-900 text-yellow-200'
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [labelOrder, setLabelOrder] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewOrder, setReviewOrder] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const [l, o, p, sp, rv] = await Promise.all([
          base44.entities.Listing.filter({ seller_id: u.id }, '-created_date', 50),
          base44.entities.Order.filter({ seller_id: u.id }, '-created_date', 50),
          base44.entities.Order.filter({ buyer_id: u.id }, '-created_date', 50),
          base44.entities.SellerProfile.filter({ user_id: u.id }),
          base44.entities.Review.filter({ buyer_id: u.id }, '-created_date', 50)
        ]);
        setListings(l);
        setOrders(o);
        setPurchases(p);
        setSellerProfile(sp[0] || null);
        setReviews(rv);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const reloadProfile = async () => {
    const u = await base44.auth.me();
    const sp = await base44.entities.SellerProfile.filter({ user_id: u.id });
    setSellerProfile(sp[0] || null);
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await base44.functions.invoke('mark-order-delivered', { order_id: orderId });
      setPurchases(prev => prev.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
      toast({ title: "Marked Delivered", description: "You can now leave a review." });
    } catch (e) {
      toast({ title: "Error", description: e.response?.data?.error || e.message, variant: "destructive" });
    }
  };

  const handleReviewSubmitted = async () => {
    setReviewOrder(null);
    const rv = await base44.entities.Review.filter({ buyer_id: user.id }, '-created_date', 50);
    setReviews(rv);
    const sp = await base44.entities.SellerProfile.filter({ user_id: user.id });
    setSellerProfile(sp[0] || null);
    toast({ title: "Review Posted!", description: "Thanks for the honesty." });
  };

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');
  const pendingShipment = orders.filter(o => o.status === 'pending_shipment');
  const totalRevenue = orders.reduce((sum, o) => sum + (o.seller_payout || 0), 0);

  const handleShip = async (orderId, trackingNumber) => {
    try {
      await base44.functions.invoke('update-order-shipped', { order_id: orderId, tracking_number: trackingNumber });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'shipped', tracking_number: trackingNumber } : o));
      toast({ title: "Shipped!", description: "Tracking updated. Now we wait." });
    } catch (e) {
      toast({ title: "Error", description: e.response?.data?.error || e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-foreground">DASHBOARD</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.full_name || 'Seller'}</p>
        </div>
        <Link to="/sell">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">
            <Plus className="w-4 h-4 mr-1" /> List Item
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <Package className="w-5 h-5 text-muted-foreground mb-2" />
          <p className="text-2xl font-bold text-foreground">{activeListings.length}</p>
          <p className="text-xs text-muted-foreground">Active Listings</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Truck className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-primary">{pendingShipment.length}</p>
          <p className="text-xs text-muted-foreground">Ship That Shit</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <DollarSign className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-green-500">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Total Payouts</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Trophy className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-yellow-500">{soldListings.length}</p>
          <p className="text-xs text-muted-foreground">Items Sold</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <StarRating rating={sellerProfile?.rating || 0} size="sm" />
          <p className="text-2xl font-bold text-foreground mt-1">{(sellerProfile?.rating || 0).toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">{sellerProfile?.review_count || 0} Review{(sellerProfile?.review_count || 0) === 1 ? '' : 's'}</p>
        </div>
      </div>

      <StripeOnboarding sellerProfile={sellerProfile} />

      {sellerProfile?.onboarded && !sellerProfile?.ship_from_street1 && (
        <ShipFromAddress sellerProfile={sellerProfile} onSaved={reloadProfile} />
      )}

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="orders">Ship That Shit ({pendingShipment.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({soldListings.length})</TabsTrigger>
          <TabsTrigger value="purchases">My Purchases ({purchases.length})</TabsTrigger>
        </TabsList>

        {/* Orders to Ship */}
        <TabsContent value="orders" className="space-y-3">
          {pendingShipment.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Truck className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-display text-xl">NOTHING TO SHIP</p>
              <p className="text-sm mt-1">Go sell something first.</p>
            </div>
          )}
          {pendingShipment.map(order => (
            <OrderShipCard key={order.id} order={order} onShip={handleShip} onPrintLabel={setLabelOrder} />
          ))}
        </TabsContent>

        {/* Active Listings */}
        <TabsContent value="active" className="space-y-3">
          {activeListings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-display text-xl">NO ACTIVE LISTINGS</p>
              <Link to="/sell"><Button className="mt-3">List Something</Button></Link>
            </div>
          )}
          {activeListings.map(listing => (
            <Link key={listing.id} to={`/listing/${listing.id}`}>
              <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded bg-muted overflow-hidden shrink-0">
                  <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{listing.title}</p>
                  <p className="text-sm text-primary font-bold">${(listing.price || listing.current_bid || listing.starting_bid || 0).toFixed(2)}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{listing.selling_format}</Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </TabsContent>

        {/* Sold */}
        <TabsContent value="sold" className="space-y-3">
          {soldListings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-display text-xl">NO SALES YET</p>
            </div>
          )}
          {soldListings.map(listing => (
            <div key={listing.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-muted overflow-hidden shrink-0">
                <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{listing.title}</p>
                <p className="text-sm text-green-500 font-bold">Sold: ${listing.final_price?.toFixed(2)}</p>
              </div>
              <Badge className="bg-green-900 text-green-200 text-[10px]">SOLD</Badge>
            </div>
          ))}
        </TabsContent>

        {/* Purchases */}
        <TabsContent value="purchases" className="space-y-3">
          {purchases.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-display text-xl">NO PURCHASES</p>
              <Link to="/browse"><Button className="mt-3">Go Shopping</Button></Link>
            </div>
          )}
          {purchases.map(order => (
            <PurchaseCard
              key={order.id}
              order={order}
              review={reviews.find(r => r.order_id === order.id)}
              onMarkDelivered={handleMarkDelivered}
              onReview={setReviewOrder}
            />
          ))}
        </TabsContent>
      </Tabs>

      <PrintLabelDialog order={labelOrder} open={!!labelOrder} onClose={() => setLabelOrder(null)} onShipped={handleShip} />
      <ReviewDialog order={reviewOrder} open={!!reviewOrder} onClose={() => setReviewOrder(null)} onSubmitted={handleReviewSubmitted} />
    </div>
  );
}

function OrderShipCard({ order, onShip, onPrintLabel }) {
  const [tracking, setTracking] = useState('');
  return (
    <div className="bg-card border border-primary/30 rounded-lg p-4">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-16 h-16 rounded bg-muted overflow-hidden shrink-0">
          <img src={order.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{order.listing_title}</p>
          <p className="text-sm text-muted-foreground">Buyer: {order.buyer_name}</p>
          <p className="text-sm text-green-500 font-bold">Payout: ${order.seller_payout?.toFixed(2)}</p>
        </div>
      </div>
      {order.ship_to_street1 && (
        <div className="text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
          <p className="font-bold uppercase mb-1">Ship To:</p>
          <p>{order.ship_to_name}</p>
          <p>{order.ship_to_street1}</p>
          <p>{order.ship_to_city}, {order.ship_to_state} {order.ship_to_zip}</p>
        </div>
      )}
      <div className="flex gap-2">
        <Input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Enter tracking number" className="flex-1 bg-muted border-border text-sm" />
        <Button onClick={() => { if (tracking) onShip(order.id, tracking); }} disabled={!tracking} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-xs">
          SHIP THAT SHIT
        </Button>
      </div>
      {order.ship_to_street1 && (
        <Button onClick={() => onPrintLabel(order)} variant="outline" className="w-full mt-2 text-xs uppercase tracking-wider">
          <Printer className="w-3 h-3 mr-1" /> Print Label via Shippo
        </Button>
      )}
    </div>
  );
}