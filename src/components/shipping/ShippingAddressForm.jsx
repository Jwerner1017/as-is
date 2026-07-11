import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, Loader2 } from 'lucide-react';

export default function ShippingAddressForm({ listing, onRateSelected }) {
  const [address, setAddress] = useState({ name: '', street1: '', city: '', state: '', zip: '' });
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRates = async () => {
    if (!address.street1 || !address.city || !address.state || !address.zip) {
      setError('Please fill in all address fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('shippo-get-rates', {
        listing_id: listing.id,
        ship_to_name: address.name,
        ship_to_street1: address.street1,
        ship_to_city: address.city,
        ship_to_state: address.state,
        ship_to_zip: address.zip,
        ship_to_country: 'US'
      });
      setRates(res.data?.rates || []);
      if ((res.data?.rates || []).length === 0) {
        setError('No rates available for this address');
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRate = (rate) => {
    setSelectedRate(rate);
    onRateSelected({ ...address, shipping_cost: rate.amount, shipping_rate_id: rate.object_id, carrier: rate.carrier });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Truck className="w-4 h-4 text-primary" />
        <p className="text-xs uppercase tracking-wider font-bold">Calculated Shipping — Enter Your Address</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Label className="text-[10px] uppercase text-muted-foreground">Full Name</Label>
          <Input value={address.name} onChange={e => setAddress(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
        </div>
        <div className="col-span-2">
          <Label className="text-[10px] uppercase text-muted-foreground">Street Address</Label>
          <Input value={address.street1} onChange={e => setAddress(p => ({ ...p, street1: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">City</Label>
          <Input value={address.city} onChange={e => setAddress(p => ({ ...p, city: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">State</Label>
          <Input value={address.state} onChange={e => setAddress(p => ({ ...p, state: e.target.value.toUpperCase() }))} maxLength={2} className="mt-1 bg-muted border-border text-sm uppercase" />
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">ZIP Code</Label>
          <Input value={address.zip} onChange={e => setAddress(p => ({ ...p, zip: e.target.value }))} className="mt-1 bg-muted border-border text-sm" />
        </div>
        <div className="flex items-end">
          <Button onClick={handleGetRates} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase tracking-wider">
            {loading ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Getting Rates</> : 'Get Rates'}
          </Button>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {rates.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-[10px] uppercase text-muted-foreground">Select a shipping option:</p>
          {rates.map(rate => (
            <button key={rate.object_id} onClick={() => handleSelectRate(rate)} className={`w-full flex items-center justify-between p-2 rounded border text-left text-sm transition-colors ${selectedRate?.object_id === rate.object_id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
              <div>
                <p className="font-medium text-foreground capitalize">{rate.carrier} {rate.servicelevel_name}</p>
                <p className="text-xs text-muted-foreground">{rate.estimated_days ? `${rate.estimated_days} day(s)` : rate.duration_terms || ''}</p>
              </div>
              <span className="font-bold text-primary">${rate.amount.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}