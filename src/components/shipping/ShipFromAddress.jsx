import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ShipFromAddress({ sellerProfile, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    ship_from_name: sellerProfile?.ship_from_name || '',
    ship_from_street1: sellerProfile?.ship_from_street1 || '',
    ship_from_city: sellerProfile?.ship_from_city || '',
    ship_from_state: sellerProfile?.ship_from_state || '',
    ship_from_zip: sellerProfile?.ship_from_zip || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await base44.entities.SellerProfile.update(sellerProfile.id, form);
      toast({ title: "Address Saved", description: "Your ship-from address is set." });
      onSaved(updated);
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-primary" />
        <p className="font-display text-lg text-foreground">SHIP-FROM ADDRESS</p>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Required for calculated shipping labels. Set this once.</p>
      <div className="space-y-2">
        <div>
          <Label htmlFor="from-name" className="text-[10px] uppercase text-muted-foreground">Name / Business</Label>
          <Input id="from-name" placeholder="Your name or business" value={form.ship_from_name} onChange={e => setForm(p => ({ ...p, ship_from_name: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
        </div>
        <div>
          <Label htmlFor="from-street" className="text-[10px] uppercase text-muted-foreground">Street Address</Label>
          <Input id="from-street" placeholder="123 Main Street" value={form.ship_from_street1} onChange={e => setForm(p => ({ ...p, ship_from_street1: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="from-city" className="text-[10px] uppercase text-muted-foreground">City</Label>
            <Input id="from-city" placeholder="Los Angeles" value={form.ship_from_city} onChange={e => setForm(p => ({ ...p, ship_from_city: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
          </div>
          <div>
            <Label htmlFor="from-state" className="text-[10px] uppercase text-muted-foreground">State</Label>
            <Input id="from-state" placeholder="CA" value={form.ship_from_state} onChange={e => setForm(p => ({ ...p, ship_from_state: e.target.value.toUpperCase() }))} maxLength={2} className="mt-1 bg-muted border-border text-sm uppercase" />
          </div>
          <div>
            <Label htmlFor="from-zip" className="text-[10px] uppercase text-muted-foreground">ZIP Code</Label>
            <Input id="from-zip" inputMode="numeric" placeholder="90001" value={form.ship_from_zip} onChange={e => setForm(p => ({ ...p, ship_from_zip: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider">
          {saving ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </div>
  );
}