import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Zap, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CONDITIONS, SELLING_FORMATS, SHIPPING_TYPES } from '@/lib/categories';

export default function TemplateDialog({ open, onOpenChange, onApply }) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [newName, setNewName] = useState('');
  const [saveForm, setSaveForm] = useState({
    condition: '', shipping_type: 'Free Shipping', selling_format: 'Buy It Now',
    shipping_cost: '', is_replica: false, description_boilerplate: ''
  });

  const loadTemplates = async () => {
    try {
      const user = await base44.auth.me();
      const data = await base44.entities.ListingTemplate.filter({ user_id: user.id }, '-created_date', 50);
      setTemplates(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (open) loadTemplates();
  }, [open]);

  const handleSave = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.ListingTemplate.create({
        name: newName.trim(),
        user_id: user.id,
        condition: saveForm.condition || undefined,
        selling_format: saveForm.selling_format,
        shipping_type: saveForm.shipping_type,
        shipping_cost: saveForm.shipping_cost ? parseFloat(saveForm.shipping_cost) : undefined,
        is_replica: saveForm.is_replica,
        description_boilerplate: saveForm.description_boilerplate || undefined
      });
      setNewName('');
      setSaveForm({ condition: '', shipping_type: 'Free Shipping', selling_format: 'Buy It Now', shipping_cost: '', is_replica: false, description_boilerplate: '' });
      setShowSave(false);
      await loadTemplates();
      toast({ title: "Template Saved!", description: "Use it next time with one click." });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await base44.entities.ListingTemplate.delete(id);
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({ title: "Template deleted" });
  };

  const handleApply = (tpl) => {
    onApply(tpl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">LISTING TEMPLATES</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Save your standard shipping & condition terms. One click to autofill.
          </DialogDescription>
        </DialogHeader>

        {!showSave ? (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {templates.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No templates yet. Save one to speed up your listings.
              </p>
            )}
            {templates.map(tpl => (
              <div key={tpl.id} className="bg-muted/40 border border-border rounded-lg p-3 flex items-center gap-3">
                <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{tpl.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {tpl.condition || '—'} · {tpl.selling_format} · {tpl.shipping_type}{tpl.shipping_type !== 'Free Shipping' && tpl.shipping_cost ? ` $${tpl.shipping_cost}` : ''}
                  </p>
                </div>
                <Button size="sm" onClick={() => handleApply(tpl)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-xs h-8">
                  Autofill
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(tpl.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Template Name</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. My Standard Shipping" className="mt-1 bg-muted border-border" />
            </div>
            <p className="text-xs text-muted-foreground">Pick the standard terms you want saved. Leave others blank to skip them.</p>
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Condition (optional)</Label>
              <Select value={saveForm.condition || '__none__'} onValueChange={v => setSaveForm(p => ({ ...p, condition: v === '__none__' ? '' : v }))}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Any</SelectItem>
                  {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Selling Format</Label>
              <Select value={saveForm.selling_format} onValueChange={v => setSaveForm(p => ({ ...p, selling_format: v }))}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SELLING_FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Shipping</Label>
              <Select value={saveForm.shipping_type} onValueChange={v => setSaveForm(p => ({ ...p, shipping_type: v }))}>
                <SelectTrigger className="mt-1 bg-muted border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SHIPPING_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {saveForm.shipping_type !== 'Free Shipping' && (
              <div>
                <Label className="text-xs uppercase tracking-wider font-bold">Shipping Cost ($)</Label>
                <Input type="number" step="0.01" min="0" value={saveForm.shipping_cost} onChange={e => setSaveForm(p => ({ ...p, shipping_cost: e.target.value }))} className="mt-1 bg-muted border-border" />
              </div>
            )}
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <Switch checked={saveForm.is_replica} onCheckedChange={v => setSaveForm(p => ({ ...p, is_replica: v }))} />
              <p className="text-sm text-foreground">Default to replica</p>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider font-bold">Description Boilerplate (optional)</Label>
              <Textarea value={saveForm.description_boilerplate} onChange={e => setSaveForm(p => ({ ...p, description_boilerplate: e.target.value }))} placeholder="Default text appended to every listing..." className="mt-1 bg-muted border-border min-h-[80px]" />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {!showSave ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={() => setShowSave(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold uppercase text-sm">
                <Save className="w-4 h-4 mr-1" /> New Template
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowSave(false)}>Back</Button>
              <Button onClick={handleSave} disabled={loading || !newName.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase text-sm">
                {loading ? 'Saving...' : 'Save Template'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}