import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Gavel, ShoppingBag, Truck, Star, Package, CheckCheck, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment';

const TYPE_CONFIG = {
  new_bid: { icon: Gavel, color: 'text-accent', bg: 'bg-accent/10' },
  purchase: { icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
  shipping_update: { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  review: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  listing_sold: { icon: Package, color: 'text-green-500', bg: 'bg-green-500/10' },
  system: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted' }
};

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const u = await base44.auth.me();
      const n = await base44.entities.Notification.filter({ user_id: u.id }, '-created_date', 100);
      setNotifications(n);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await base44.entities.Notification.update(id, { read: true });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const unread = notifications.filter(n => !n.read);
      const updates = unread.map(n => ({ id: n.id, read: true }));
      if (updates.length > 0) {
        await base44.entities.Notification.bulkUpdate(updates);
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({ title: "All caught up", description: "Marked all as read." });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setMarkingAll(false);
    }
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;
  const filterTypes = ['all', 'new_bid', 'purchase', 'shipping_update', 'review', 'listing_sold'];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-foreground">NOTIFICATIONS</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            variant="outline"
            className="text-xs uppercase font-bold"
          >
            {markingAll ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <CheckCheck className="w-3 h-3 mr-1" />}
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {filterTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-md text-xs uppercase font-bold whitespace-nowrap transition-colors ${
              filter === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {type === 'all' ? 'All' : type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-display text-xl">NO NOTIFICATIONS</p>
          <p className="text-sm mt-1">You're all caught up. Nothing to see here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={`bg-card border rounded-lg p-4 flex items-start gap-3 transition-colors ${
                  n.read ? 'border-border' : 'border-primary/40 bg-primary/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{moment(n.created_date).fromNow()}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {n.link && (
                    <Link to={n.link}>
                      <Button variant="ghost" size="sm" className="text-xs h-7">View</Button>
                    </Link>
                  )}
                  {!n.read && (
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleMarkRead(n.id)}>
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}