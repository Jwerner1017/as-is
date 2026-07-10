import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { CATEGORIES, CONDITIONS, SELLING_FORMATS, SHIPPING_TYPES } from '@/lib/categories';

export default function Sell() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', category: '', subcategory: '', condition: '',
    selling_format: 'Buy It Now', price: '', starting_bid: '', auction_end: '',
    shipping_type: 'Free Shipping', shipping_cost: '', is_replica: false,
    weight: '', length: '', width: '', height: ''
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) { setProfileLoading(false); return; }
      base44.entities.SellerProfile.filter({ user_id: u.id })
        .then(profiles => { setProfile(profiles[0] || null); setProfileLoading(false); })
        .catch(() => setProfileLoading(false));
    }).catch(() => setProfileLoading(false));
  }, []);

  const selectedCategory = CATEGORIES.find(c => c.name === form.category);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImages(prev => [...prev, file_url]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const data = {
        ...form,
        images,
        price: form.price ? parseFloat(form.price) : undefined,
        starting_bid: form.starting_bid ? parseFloat(form.starting_bid) : undefined,
        shipping_cost: form.shipping_cost ? parseFloat(form.shipping_cost) : undefined,
        current_bid: form.starting_bid ? parseFloat(form.starting_bid) : undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        length: form.length ? parseFloat(form.length) : undefined,
        width: form.width ? parseFloat(form.width) : undefined,
        height: form.height ? parseFloat(form.height) : undefined,
        distance_unit: 'in',
        mass_unit: 'lb',
        seller_id: user.id,
        seller_name: user.full_name || 'Seller',
        status: 'active'
      };
      const listing = await base44.entities.Listing.create(data);
      toast({ title: "Listed!", description: "Your item is live. Now sit back and wait for the chaos." });
      navigate(`/listing/${listing.id}`);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl text-foreground mb-2">LIST YOUR SHIT</h1>
      <p className="text-sm text-muted-foreground mb-8">Be honest. Be detailed. Liars get banned.</p>

      {profileLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : !profile?.onboarded ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="font-display text-2xl text-foreground mb-2">VERIFICATION REQUIRED</p>
          <p className="text-sm text-muted-foreground mb-6">
            You need to complete Stripe onboarding before you can list items. This ensures you can receive payouts.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">
            Go to Dashboard
          </Button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div>
          <Label className="text-xs uppercase tracking-wider font-bold">Photos</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">Add</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <Label className="text-xs uppercase tracking-wider font-bold">Title</Label>
          <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What are you selling?" className="mt-1 bg-card border-border" required />
        </div>

        {/* Description */}
        <div>
          <Label className="text-xs uppercase tracking-wider font-bold">Description</Label>
          <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Be detailed. Mention any flaws, scratches, missing parts. Honesty saves your ass." className="mt-1 bg-card border-border min-h-[120px]" required />
        </div>

        {/* Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Category</Label>
            <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v, subcategory: '' }))}>
              <SelectTrigger className="mt-1 bg-card border-border"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Subcategory</Label>
            <Select value={form.subcategory} onValueChange={v => setForm(p => ({ ...p, subcategory: v }))} disabled={!selectedCategory}>
              <SelectTrigger className="mt-1 bg-card border-border"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {selectedCategory?.subcategories.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Condition & Format */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Condition</Label>
            <Select value={form.condition} onValueChange={v => setForm(p => ({ ...p, condition: v }))}>
              <SelectTrigger className="mt-1 bg-card border-border"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Selling Format</Label>
            <Select value={form.selling_format} onValueChange={v => setForm(p => ({ ...p, selling_format: v }))}>
              <SelectTrigger className="mt-1 bg-card border-border"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {SELLING_FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price */}
        {form.selling_format === 'Buy It Now' && (
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Price ($)</Label>
            <Input type="number" step="0.01" min="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" className="mt-1 bg-card border-border" required />
          </div>
        )}

        {(form.selling_format === 'Auction' || form.selling_format === 'Live') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Starting Bid ($)</Label>
              <Input type="number" step="0.01" min="0.01" value={form.starting_bid} onChange={e => setForm(p => ({ ...p, starting_bid: e.target.value }))} placeholder="0.01" className="mt-1 bg-card border-border" required />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Auction End</Label>
              <Input type="datetime-local" value={form.auction_end} onChange={e => setForm(p => ({ ...p, auction_end: e.target.value }))} className="mt-1 bg-card border-border" required />
            </div>
          </div>
        )}

        {/* Shipping */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Shipping</Label>
            <Select value={form.shipping_type} onValueChange={v => setForm(p => ({ ...p, shipping_type: v }))}>
              <SelectTrigger className="mt-1 bg-card border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SHIPPING_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {form.shipping_type !== 'Free Shipping' && (
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Shipping Cost ($)</Label>
              <Input type="number" step="0.01" min="0" value={form.shipping_cost} onChange={e => setForm(p => ({ ...p, shipping_cost: e.target.value }))} className="mt-1 bg-card border-border" />
            </div>
          )}
        </div>

        {/* Package dimensions for calculated shipping */}
        {form.shipping_type === 'Calculated' && (
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-foreground">Package Details</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Used to calculate live shipping rates at checkout</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">Weight (lb)</Label>
                <Input type="number" step="0.1" min="0.1" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} placeholder="1.0" className="mt-1 bg-muted border-border text-sm" required />
              </div>
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">Length (in)</Label>
                <Input type="number" step="0.1" min="0.1" value={form.length} onChange={e => setForm(p => ({ ...p, length: e.target.value }))} placeholder="5" className="mt-1 bg-muted border-border text-sm" required />
              </div>
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">Width (in)</Label>
                <Input type="number" step="0.1" min="0.1" value={form.width} onChange={e => setForm(p => ({ ...p, width: e.target.value }))} placeholder="5" className="mt-1 bg-muted border-border text-sm" required />
              </div>
              <div>
                <Label className="text-[10px] uppercase text-muted-foreground">Height (in)</Label>
                <Input type="number" step="0.1" min="0.1" value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))} placeholder="5" className="mt-1 bg-muted border-border text-sm" required />
              </div>
            </div>
          </div>
        )}

        {/* Replica toggle */}
        <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
          <Switch checked={form.is_replica} onCheckedChange={v => setForm(p => ({ ...p, is_replica: v }))} />
          <div>
            <p className="text-sm font-medium text-foreground">This is a replica</p>
            <p className="text-xs text-muted-foreground">Must be labeled REPLICA in title and photos</p>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase tracking-wider h-14">
          {loading ? 'Listing...' : 'LIST IT'}
        </Button>
      </form>
      )}
    </div>
  );
}