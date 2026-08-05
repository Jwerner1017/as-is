import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, CreditCard, Loader2, Save, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function PersonalInfoTab({ user, onSaved }) {
  const { toast } = useToast();
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.phone || '',
        default_ship_name: user.default_ship_name || user.full_name || '',
        default_ship_street1: user.default_ship_street1 || '',
        default_ship_street2: user.default_ship_street2 || '',
        default_ship_city: user.default_ship_city || '',
        default_ship_state: user.default_ship_state || '',
        default_ship_zip: user.default_ship_zip || '',
        default_ship_country: user.default_ship_country || 'US'
      });
    }
  }, [user]);

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
      toast({ title: "Saved", description: "Your info is locked in." });
      if (onSaved) onSaved();
    } catch (e) {
      toast({ title: "Error", description: e.response?.data?.error || e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4 text-primary" />
          <h3 className="font-display text-lg text-foreground">CONTACT INFO</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase text-muted-foreground">Full Name</Label>
            <Input
              value={form.default_ship_name}
              onChange={handleChange('default_ship_name')}
              placeholder="Your name"
              className="mt-1 bg-muted border-border"
            />
          </div>
          <div>
            <Label className="text-xs uppercase text-muted-foreground">Phone</Label>
            <Input
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="(555) 123-4567"
              className="mt-1 bg-muted border-border"
            />
          </div>
        </div>
      </div>

      {/* Default Shipping Address */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-display text-lg text-foreground">DEFAULT SHIPPING ADDRESS</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Saved for faster checkout. This will pre-fill your shipping address when you buy something.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-xs uppercase text-muted-foreground">Street Address</Label>
            <Input
              value={form.default_ship_street1}
              onChange={handleChange('default_ship_street1')}
              placeholder="123 Main St"
              className="mt-1 bg-muted border-border"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs uppercase text-muted-foreground">Apt / Suite (optional)</Label>
            <Input
              value={form.default_ship_street2}
              onChange={handleChange('default_ship_street2')}
              placeholder="Apt 4B"
              className="mt-1 bg-muted border-border"
            />
          </div>
          <div>
            <Label className="text-xs uppercase text-muted-foreground">City</Label>
            <Input
              value={form.default_ship_city}
              onChange={handleChange('default_ship_city')}
              placeholder="New York"
              className="mt-1 bg-muted border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase text-muted-foreground">State</Label>
              <Input
                value={form.default_ship_state}
                onChange={handleChange('default_ship_state')}
                placeholder="NY"
                maxLength={2}
                className="mt-1 bg-muted border-border uppercase"
              />
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground">ZIP</Label>
              <Input
                value={form.default_ship_zip}
                onChange={handleChange('default_ship_zip')}
                placeholder="10001"
                className="mt-1 bg-muted border-border"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs uppercase text-muted-foreground">Country</Label>
            <Input
              value={form.default_ship_country}
              onChange={handleChange('default_ship_country')}
              placeholder="US"
              className="mt-1 bg-muted border-border"
            />
          </div>
        </div>
      </div>

      {/* Payment Info Note */}
      <div className="bg-card border border-border rounded-lg p-5">
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
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider"
      >
        {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving</> : <><Save className="w-4 h-4 mr-1" /> Save Personal Info</>}
      </Button>
    </div>
  );
}