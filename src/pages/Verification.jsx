import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';

export default function Verification() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkUserAuth } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    default_ship_name: '',
    default_ship_street1: '',
    default_ship_street2: '',
    default_ship_city: '',
    default_ship_state: '',
    default_ship_zip: '',
    default_ship_country: 'US'
  });

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u);
        if (u) {
          setForm({
            phone: u.phone || '',
            default_ship_name: u.default_ship_name || u.full_name || '',
            default_ship_street1: u.default_ship_street1 || '',
            default_ship_street2: u.default_ship_street2 || '',
            default_ship_city: u.default_ship_city || '',
            default_ship_state: u.default_ship_state || '',
            default_ship_zip: u.default_ship_zip || '',
            default_ship_country: u.default_ship_country || 'US'
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: field === 'default_ship_state' ? value.toUpperCase() : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        phone: form.phone,
        default_ship_name: form.default_ship_name,
        default_ship_street1: form.default_ship_street1,
        default_ship_street2: form.default_ship_street2,
        default_ship_city: form.default_ship_city,
        default_ship_state: form.default_ship_state,
        default_ship_zip: form.default_ship_zip,
        default_ship_country: form.default_ship_country
      });
      await checkUserAuth();
      toast({ title: "Verified!", description: "Your account is confirmed. Full access granted." });
      navigate('/dashboard');
    } catch (e) {
      toast({ title: "Error", description: e.response?.data?.error || e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const isConfirmed = user?.default_ship_street1;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-40 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="font-display text-4xl text-foreground">ACCOUNT VERIFICATION</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Confirm your address and payment info to unlock bidding, selling, and live streaming.
      </p>

      {isConfirmed && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-500">Already Verified</p>
            <p className="text-xs text-muted-foreground">Your account is confirmed. You have full access.</p>
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-card border border-border rounded-lg p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-display text-lg text-foreground">SHIPPING ADDRESS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase text-muted-foreground">Full Name</Label>
            <Input value={form.default_ship_name} onChange={handleChange('default_ship_name')} placeholder="Your name" className="mt-1 bg-muted border-border" />
          </div>
          <div>
            <Label className="text-xs uppercase text-muted-foreground">Phone</Label>
            <Input value={form.phone} onChange={handleChange('phone')} placeholder="(555) 123-4567" className="mt-1 bg-muted border-border" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs uppercase text-muted-foreground">Street Address</Label>
            <Input value={form.default_ship_street1} onChange={handleChange('default_ship_street1')} placeholder="123 Main St" className="mt-1 bg-muted border-border" />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs uppercase text-muted-foreground">Apt / Suite (optional)</Label>
            <Input value={form.default_ship_street2} onChange={handleChange('default_ship_street2')} placeholder="Apt 4B" className="mt-1 bg-muted border-border" />
          </div>
          <div>
            <Label className="text-xs uppercase text-muted-foreground">City</Label>
            <Input value={form.default_ship_city} onChange={handleChange('default_ship_city')} placeholder="New York" className="mt-1 bg-muted border-border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-muted-foreground">State</Label>
              <Input value={form.default_ship_state} onChange={handleChange('default_ship_state')} placeholder="NY" maxLength={2} className="mt-1 bg-muted border-border uppercase" />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground">ZIP</Label>
              <Input value={form.default_ship_zip} onChange={handleChange('default_ship_zip')} placeholder="10001" className="mt-1 bg-muted border-border" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-primary" />
          <h3 className="font-display text-lg text-foreground">PAYMENT INFO</h3>
        </div>
        <div className="flex items-start gap-3 bg-muted/40 rounded-lg p-4">
          <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Payments handled securely by Stripe</p>
            <p className="text-xs text-muted-foreground mt-1">
              We don't store your card details. Every checkout is processed through Stripe's encrypted
              payment system. Your card info never touches our servers.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider h-14"
      >
        {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Verifying</> : <><ShieldCheck className="w-5 h-5 mr-2" /> Verify My Account</>}
      </Button>
    </div>
  );
}