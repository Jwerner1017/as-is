import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Trash2, DollarSign, Loader2, CheckSquare, Square } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

export default function Inventory() {
  const { toast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [priceMode, setPriceMode] = useState(null); // null | 'percent' | 'fixed'
  const [priceValue, setPriceValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const u = await base44.auth.me();
      const l = await base44.entities.Listing.filter({ seller_id: u.id, status: 'active' }, '-created_date', 200);
      setListings(l);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === listings.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(listings.map(l => l.id)));
    }
  };

  const handleBulkPrice = async () => {
    const val = parseFloat(priceValue);
    if (isNaN(val)) {
      toast({ title: "Invalid value", description: "Enter a valid number.", variant: "destructive" });
      return;
    }
    setActionLoading(true);
    try {
      const updates = [];
      for (const id of selected) {
        const listing = listings.find(l => l.id === id);
        if (!listing) continue;
        let newPrice;
        if (priceMode === 'percent') {
          newPrice = Math.max(0.01, parseFloat((listing.price * (1 + val / 100)).toFixed(2)));
        } else {
          newPrice = Math.max(0.01, val);
        }
        updates.push({ id, price: newPrice });
      }
      await base44.entities.Listing.bulkUpdate(updates);
      await loadListings();
      setSelected(new Set());
      setPriceMode(null);
      setPriceValue('');
      toast({ title: "Prices Updated", description: `${updates.length} listing${updates.length === 1 ? '' : 's'} updated.` });
    } catch (e) {
      toast({ title: "Error", description: e.response?.data?.error || e.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelist = async () => {
    setActionLoading(true);
    try {
      const updates = Array.from(selected).map(id => ({ id, status: 'ended' }));
      await base44.entities.Listing.bulkUpdate(updates);
      await loadListings();
      setSelected(new Set());
      toast({ title: "Delisted", description: `${updates.length} listing${updates.length === 1 ? '' : 's'} taken down.` });
    } catch (e) {
      toast({ title: "Error", description: e.response?.data?.error || e.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-foreground">INVENTORY MANAGER</h1>
          <p className="text-sm text-muted-foreground">{listings.length} active listing{listings.length === 1 ? '' : 's'}</p>
        </div>
        <Link to="/sell">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-sm">
            List Item
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-display text-xl">NO ACTIVE LISTINGS</p>
          <Link to="/sell"><Button className="mt-4">List Something</Button></Link>
        </div>
      ) : (
        <>
          {/* Bulk Action Bar */}
          {selected.size > 0 && (
            <div className="bg-card border border-primary rounded-lg p-3 flex flex-wrap items-center gap-3 mb-4 sticky top-2 z-10">
              <span className="text-sm font-bold text-foreground">{selected.size} selected</span>
              <div className="flex items-center gap-2 ml-auto">
                {priceMode && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={priceValue}
                      onChange={e => setPriceValue(e.target.value)}
                      placeholder={priceMode === 'percent' ? "-10" : "29.99"}
                      className="w-28 bg-muted border-border text-sm h-9"
                    />
                    <Button onClick={handleBulkPrice} disabled={actionLoading} size="sm" className="bg-primary text-primary-foreground font-bold uppercase text-xs">
                      {actionLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <DollarSign className="w-3 h-3 mr-1" />}
                      Apply
                    </Button>
                    <Button onClick={() => { setPriceMode(null); setPriceValue(''); }} variant="ghost" size="sm" className="text-xs">Cancel</Button>
                  </div>
                )}
                {!priceMode && (
                  <>
                    <Button onClick={() => setPriceMode('percent')} variant="outline" size="sm" className="text-xs uppercase font-bold">
                      Adjust by %
                    </Button>
                    <Button onClick={() => setPriceMode('fixed')} variant="outline" size="sm" className="text-xs uppercase font-bold">
                      Set Price
                    </Button>
                  </>
                )}
                <Button onClick={handleBulkDelist} disabled={actionLoading} variant="destructive" size="sm" className="text-xs uppercase font-bold">
                  {actionLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
                  Delist
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-3 text-left w-10">
                    <Checkbox
                      checked={selected.size === listings.length && listings.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left text-xs uppercase text-muted-foreground font-bold">Item</th>
                  <th className="p-3 text-left text-xs uppercase text-muted-foreground font-bold hidden md:table-cell">Category</th>
                  <th className="p-3 text-right text-xs uppercase text-muted-foreground font-bold">Price</th>
                  <th className="p-3 text-center text-xs uppercase text-muted-foreground font-bold hidden md:table-cell">Bids</th>
                  <th className="p-3 text-left text-xs uppercase text-muted-foreground font-bold">Format</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Checkbox
                        checked={selected.has(listing.id)}
                        onCheckedChange={() => toggleSelect(listing.id)}
                      />
                    </td>
                    <td className="p-3">
                      <Link to={`/listing/${listing.id}`} className="flex items-center gap-3 hover:text-primary">
                        <div className="w-10 h-10 rounded bg-muted overflow-hidden shrink-0">
                          <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-sm text-foreground truncate max-w-[200px]">{listing.title}</span>
                      </Link>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{listing.category}</td>
                    <td className="p-3 text-right text-sm font-bold text-primary">
                      ${(listing.price || listing.current_bid || listing.starting_bid || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-center text-sm text-muted-foreground hidden md:table-cell">{listing.bid_count || 0}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px]">{listing.selling_format}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}