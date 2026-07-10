import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function StripeOnboarding({ sellerProfile }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOnboard = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('stripe-onboarding', {});
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      toast({ title: 'Error', description: e.response?.data?.error || e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!sellerProfile) return null;

  if (sellerProfile.stripe_account_id && sellerProfile.onboarded) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Payouts Active</p>
          <p className="text-xs text-muted-foreground">Stripe connected — you're ready to sell</p>
        </div>
        <Badge className="bg-green-900 text-green-200">READY</Badge>
      </div>
    );
  }

  return (
    <div className="bg-card border border-primary/30 rounded-lg p-4 flex items-center gap-3 mb-6">
      <CreditCard className="w-5 h-5 text-primary" />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Set Up Payouts</p>
        <p className="text-xs text-muted-foreground">Connect Stripe to receive your seller payouts</p>
      </div>
      <Button onClick={handleOnboard} disabled={loading} className="bg-primary text-primary-foreground font-bold uppercase text-xs">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : sellerProfile.stripe_account_id ? 'FINISH SETUP' : 'CONNECT'}
      </Button>
    </div>
  );
}