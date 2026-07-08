import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CATEGORIES } from '@/lib/categories';

const GAME_TYPES = ['Mystery Box', 'Spin the Wheel', 'Pick a Number', 'First to Comment', 'Giveaway', 'None'];
const MOD_LEVELS = [
  { value: 'chill', label: 'Chill — say whatever' },
  { value: 'moderate', label: 'Moderate — some filtering' },
  { value: 'strict', label: 'Strict — no nonsense' }
];

export default function GoLiveDialog({ open, onOpenChange, onCreated }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', game_type: 'None', moderation_level: 'moderate'
  });

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const stream = await base44.entities.LiveStream.create({
        seller_id: user.id,
        seller_name: user.full_name || 'Seller',
        title: form.title.trim(),
        description: form.description || undefined,
        status: 'live',
        viewer_count: 0,
        moderation_level: form.moderation_level,
        game_type: form.game_type === 'None' ? undefined : form.game_type,
        category: form.category || undefined
      });
      setForm({ title: '', description: '', category: '', game_type: 'None', moderation_level: 'moderate' });
      onOpenChange(false);
      onCreated?.(stream);
      toast({ title: "You're LIVE!", description: "Show the item on camera. Don't break the rules." });
      navigate('/');
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <DialogTitle className="font-display text-2xl text-foreground">GO LIVE</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Start your live stream. Show the item on camera. No BS.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Stream Title</Label>
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Midnight Card Breaks" className="mt-1 bg-muted border-border" required />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Description (optional)</Label>
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What are you selling / playing?" className="mt-1 bg-muted border-border min-h-[70px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Game</Label>
              <Select value={form.game_type} onValueChange={v => setForm(p => ({ ...p, game_type: v }))}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GAME_TYPES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-bold">Moderation</Label>
            <Select value={form.moderation_level} onValueChange={v => setForm(p => ({ ...p, moderation_level: v }))}>
              <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOD_LEVELS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading || !form.title.trim()} className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider">
            {loading ? 'Going live...' : 'START STREAM'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}