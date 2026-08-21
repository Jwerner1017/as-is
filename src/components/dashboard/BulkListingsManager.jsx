import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Package, ChevronRight, Loader2, Trash2, Pencil, Zap } from 'lucide-react';

export default function BulkListingsManager({ listings, onRefresh }) {
  const [selected, setSelected] = useState(new Set());
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === listings.length) setSelected(new Set());
    else setSelected(new Set(listings.map(l => l.id)));
  };

  const clear = () => setSelected(new Set());

  const handleBulkEdit = async () => {
    setLoading(true);
    try {
      const updates = Array.from(selected).map(id => {
        const patch = {};
        if (editStatus) patch.status = editStatus;
        if (editPrice !== '') patch.price = parseFloat(editPrice);
        return { id, ...patch };
      });
      await base44.entities.Listing.bulkUpdate(updates);
      toast({ title: `Updated ${updates.length} listing${updates.length === 1 ? '' : 's'}` });
      setEditOpen(false);
      setEditStatus('');
      setEditPrice('');
      clear();
      onRefresh();
    } catch (e) {
      toast({ title: 'Update failed', description: e.response?.data?.error || e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(Array.from(selected).map(id => base44.entities.Listing.delete(id)));
      toast({ title: `Deleted ${selected.size} listing${selected.size === 1 ? '' : 's'}` });
      setDeleteOpen(false);
      clear();
      onRefresh();
    } catch (e) {
      toast({ title: 'Delete failed', description: e.response?.data?.error || e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p className="font-display text-xl">NO ACTIVE LISTINGS</p>
        <Link to="/sell"><Button className="mt-3">List Something</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Bulk action bar */}
      <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-3 sticky top-2 z-10">
        <Checkbox
          checked={selected.size === listings.length}
          onCheckedChange={toggleAll}
        />
        <span className="text-sm text-muted-foreground">
          {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
        </span>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={() => setEditOpen(true)}
              variant="outline"
              className="text-xs uppercase tracking-wider"
            >
              <Pencil className="w-3 h-3 mr-1" /> Edit
            </Button>
            <Button
              onClick={() => setDeleteOpen(true)}
              variant="destructive"
              className="text-xs uppercase tracking-wider"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Listings */}
      {listings.map(listing => (
        <div
          key={listing.id}
          className={`bg-card border rounded-lg p-4 flex items-center gap-4 transition-colors ${selected.has(listing.id) ? 'border-primary' : 'border-border'}`}
        >
          <Checkbox
            checked={selected.has(listing.id)}
            onCheckedChange={() => toggle(listing.id)}
            className="shrink-0"
          />
          <Link to={`/listing/${listing.id}`} className="flex items-center gap-4 flex-1 min-w-0 hover:opacity-80">
            <div className="w-16 h-16 rounded bg-muted overflow-hidden shrink-0">
              <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{listing.title}</p>
              <p className="text-sm text-primary font-bold">${(listing.price || listing.current_bid || listing.starting_bid || 0).toFixed(2)}</p>
            </div>
          </Link>
          <Badge variant="outline" className="text-[10px]">{listing.selling_format}</Badge>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      ))}

      {/* Bulk Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground">BULK EDIT</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Apply changes to {selected.size} listing{selected.size === 1 ? '' : 's'}. Leave a field blank to skip it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Don't change" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-price">Price (Buy It Now)</Label>
              <Input
                id="bulk-price"
                type="number"
                step="0.01"
                min="0"
                value={editPrice}
                onChange={e => setEditPrice(e.target.value)}
                placeholder="Don't change"
                className="bg-muted border-border"
              />
              <p className="text-xs text-muted-foreground">Only applies to Buy It Now listings.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1">Cancel</Button>
              <Button
                onClick={handleBulkEdit}
                disabled={loading || (!editStatus && editPrice === '')}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Zap className="w-4 h-4 mr-1" />}
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl text-foreground">DELETE {selected.size} LISTING{selected.size === 1 ? '' : 'S'}?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This permanently removes the selected listing{selected.size === 1 ? '' : 's'}. No refunds, no take-backs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}