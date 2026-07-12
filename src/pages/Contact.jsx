import React, { useState } from 'react';
import { Mail, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Missing fields", description: "Fill out everything please.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: 'support@asis.marketplace',
        subject: `Contact form: ${form.name}`,
        body: `From: ${form.name} (${form.email})\n\n${form.message}`
      });
      toast({ title: "Message Sent", description: "We'll get back to you. Maybe." });
      setForm({ name: '', email: '', message: '' });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-foreground mb-2">CONTACT US</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Got a question, a problem, or just want to yell at us? Drop a message below.
      </p>

      <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 mb-8">
        <Mail className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs uppercase text-muted-foreground">Email</p>
          <p className="text-sm font-medium text-foreground">support@asis.marketplace</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6">
        <div>
          <Label className="text-xs uppercase text-muted-foreground">Name</Label>
          <Input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            className="mt-1 bg-muted border-border"
          />
        </div>
        <div>
          <Label className="text-xs uppercase text-muted-foreground">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
            className="mt-1 bg-muted border-border"
          />
        </div>
        <div>
          <Label className="text-xs uppercase text-muted-foreground">Message</Label>
          <Textarea
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            placeholder="What's on your mind?"
            className="mt-1 bg-muted border-border min-h-[120px]"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">
          {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Sending</> : <><MessageSquare className="w-4 h-4 mr-1" /> Send Message</>}
        </Button>
      </form>
    </div>
  );
}