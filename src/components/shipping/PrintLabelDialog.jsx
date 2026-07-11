import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Printer, Check } from 'lucide-react';

export default function PrintLabelDialog({ order, open, onClose, onShipped }) {
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [label, setLabel] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && order) {
      setLabel(null);
      setRates([]);
      setSelectedRate(null);
      setError('');
      loadRates();
    }
  }, [open, order?.id]);

  const loadRates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('shippo-get-rates', {
        listing_id: order.listing_id,
        ship_to_name: order.ship_to_name,
        ship_to_street1: order.ship_to_street1,
        ship_to_city: order.ship_to_city,
        ship_to_state: order.ship_to_state,
        ship_to_zip: order.ship_to_zip,
        ship_to_country: order.ship_to_country || 'US'
      });
      const r = res.data?.rates || [];
      setRates(r);
      if (r.length > 0) setSelectedRate(r[0]);
      if (r.length === 0) setError('No rates available for this shipment');
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedRate) return;
    setPurchasing(true);
    setError('');
    try {
      const res = await base44.functions.invoke('shippo-create-label', {
        order_id: order.id,
        rate_id: selectedRate.object_id
      });
      setLabel(res.data);
      onShipped(order.id, res.data.tracking_number);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">PRINT SHIPPING LABEL</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {order?.listing_title}
          </DialogDescription>
        </DialogHeader>

        {label ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-500">
              <Check className="w-5 h-5 shrink-0" />
              <p className="font-medium text-sm">Label created! Tracking: {label.tracking_number}</p>
            </div>
            <a href={label.label_url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">
                <Printer className="w-4 h-4 mr-2" /> Download / Print Label
              </Button>
            </a>
            <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Getting rates...</span>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              <p className="font-bold uppercase mb-1">Ship To:</p>
              <p>{order?.ship_to_name}</p>
              <p>{order?.ship_to_street1}</p>
              <p>{order?.ship_to_city}, {order?.ship_to_state} {order?.ship_to_zip}</p>
            </div>
            {rates.length > 0 && (
              <>
                <p className="text-[10px] uppercase text-muted-foreground">Select a shipping option:</p>
                {rates.map(rate => (
                  <button key={rate.object_id} onClick={() => setSelectedRate(rate)} className={`w-full flex items-center justify-between p-2 rounded border text-left text-sm transition-colors ${selectedRate?.object_id === rate.object_id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                    <div>
                      <p className="font-medium text-foreground capitalize">{rate.carrier} {rate.servicelevel_name}</p>
                      <p className="text-xs text-muted-foreground">{rate.estimated_days ? `${rate.estimated_days} day(s)` : ''}</p>
                    </div>
                    <span className="font-bold text-primary">${rate.amount.toFixed(2)}</span>
                  </button>
                ))}
                <Button onClick={handlePurchase} disabled={purchasing || !selectedRate} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">
                  {purchasing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Purchasing...</> : 'Purchase & Print Label'}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}