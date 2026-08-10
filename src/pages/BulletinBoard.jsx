import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Megaphone, Pin, Plus, Pencil, Trash2, Wrench, Sparkles, Bell, RefreshCw } from 'lucide-react';
import moment from 'moment';

const TYPE_CONFIG = {
  update: { label: 'Update', icon: RefreshCw, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  announcement: { label: 'Announcement', icon: Megaphone, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  maintenance: { label: 'Maintenance', icon: Wrench, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  new_feature: { label: 'New Feature', icon: Sparkles, color: 'bg-green-500/10 text-green-400 border-green-500/30' },
};

export default function BulletinBoard() {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'update', pinned: false });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [bulletinData, userData] = await Promise.all([
        base44.entities.Bulletin.list('-date', 100),
        base44.auth.isAuthenticated().then(async (authed) => (authed ? base44.auth.me() : null)),
      ]);
      setBulletins(bulletinData);
      setUser(userData);
      setIsAdmin(userData?.role === 'admin');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load bulletins' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', type: 'update', pinned: false });
    setDialogOpen(true);
  };

  const openEdit = (bulletin) => {
    setEditingId(bulletin.id);
    setFormData({ title: bulletin.title, content: bulletin.content, type: bulletin.type, pinned: bulletin.pinned });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Title and content are required' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        date: new Date().toISOString(),
        author: user?.full_name || user?.email || 'Admin',
      };
      if (editingId) {
        await base44.entities.Bulletin.update(editingId, payload);
        toast({ title: 'Bulletin updated' });
      } else {
        await base44.entities.Bulletin.create(payload);
        toast({ title: 'Bulletin posted' });
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save bulletin' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.Bulletin.delete(id);
      toast({ title: 'Bulletin deleted' });
      loadData();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete bulletin' });
    }
  };

  const sorted = [...bulletins].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date || b.created_date) - new Date(a.date || a.created_date);
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="font-display text-5xl text-foreground tracking-wider">BULLETIN BOARD</h1>
          </div>
          <p className="text-muted-foreground text-lg">Stay in the loop — upcoming updates, new features, and site changes.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <Button onClick={openCreate} className="bg-primary text-primary-foreground font-bold">
              <Plus className="w-4 h-4 mr-1" />
              New Post
            </Button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse bg-card border-border">
                <div className="h-4 w-24 bg-muted rounded mb-3"></div>
                <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-4 w-full bg-muted rounded mb-1"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
              </Card>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border">
            <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No bulletins yet. Check back soon for updates!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sorted.map((bulletin) => {
              const config = TYPE_CONFIG[bulletin.type] || TYPE_CONFIG.update;
              const Icon = config.icon;
              return (
                <Card key={bulletin.id} className={`p-6 bg-card border-border hover:border-primary/30 transition-colors ${bulletin.pinned ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge className={config.color} variant="outline">
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        {bulletin.pinned && (
                          <Badge className="bg-primary/10 text-primary border-primary/30" variant="outline">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {bulletin.date ? moment(bulletin.date).format('MMM D, YYYY') : moment(bulletin.created_date).format('MMM D, YYYY')}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl text-foreground mb-2 tracking-wide">{bulletin.title}</h2>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{bulletin.content}</p>
                      {bulletin.author && (
                        <p className="text-xs text-muted-foreground mt-3 italic">— {bulletin.author}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(bulletin)} className="text-muted-foreground hover:text-foreground">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this bulletin?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(bulletin.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Bulletin' : 'New Bulletin'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-muted border-border mt-1" placeholder="What's the update?" />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger className="bg-muted border-border mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="bg-muted border-border mt-1 min-h-[120px]" placeholder="Describe the update or change..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pinned" checked={formData.pinned} onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
              <Label htmlFor="pinned" className="cursor-pointer">Pin to top</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}