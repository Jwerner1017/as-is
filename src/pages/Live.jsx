import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Radio, Users, MessageSquare, Gamepad2, Plus, Clock, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import GoLiveDialog from '@/components/live/GoLiveDialog';
import { useToast } from '@/components/ui/use-toast';

export default function Live() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGoLive, setShowGoLive] = useState(false);

  const reload = async () => {
    try {
      const data = await base44.entities.LiveStream.filter({}, '-created_date', 20);
      setStreams(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function load() {
      await reload();
      setLoading(false);
    }
    load();
  }, []);

  const liveNow = streams.filter(s => s.status === 'live');
  const scheduled = streams.filter(s => s.status === 'scheduled');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground -ml-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button onClick={() => setShowGoLive(true)} className="bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider">
          <Radio className="w-4 h-4 mr-1" /> GO LIVE
        </Button>
      </div>

      <GoLiveDialog open={showGoLive} onOpenChange={setShowGoLive} onCreated={() => { reload(); setLoading(false); }} />

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <h1 className="font-display text-5xl md:text-6xl text-foreground">LIVE</h1>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
        <p className="text-muted-foreground">Watch sellers go live. Bid in real-time. Win games. Talk shit.</p>
      </div>

      {/* Live Now */}
      <section className="mb-10">
        <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-500 animate-pulse" /> LIVE NOW
        </h2>
        {liveNow.length === 0 && !loading && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Radio className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display text-xl text-muted-foreground">NOBODY'S LIVE RIGHT NOW</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later or be the first to go live.</p>
            <Button onClick={() => setShowGoLive(true)} className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold uppercase">
              <Radio className="w-4 h-4 mr-1" /> GO LIVE
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveNow.map(stream => (
            <StreamCard key={stream.id} stream={stream} isLive />
          ))}
        </div>
      </section>

      {/* Scheduled */}
      <section className="mb-10">
        <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" /> COMING UP
        </h2>
        {scheduled.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground">No streams scheduled.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduled.map(stream => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      {/* Live Rules */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-display text-xl text-foreground mb-3">LIVE RULES</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• No nudity or sexually explicit behavior (including background)</li>
          <li>• Must show the item on camera during live streams</li>
          <li>• Live games are allowed — giveaways, mystery boxes, spin the wheel, pick a number, first to comment wins</li>
          <li>• All games must be clearly explained before starting</li>
          <li>• Talking shit and roasting is allowed. Harassment and threats are not.</li>
        </ul>
      </section>
    </div>
  );
}

function StreamCard({ stream, isLive }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-card border rounded-lg overflow-hidden cursor-pointer ${isLive ? 'border-red-500/50' : 'border-border'}`}
    >
      <div className="aspect-video bg-muted relative">
        {stream.thumbnail_url ? (
          <img src={stream.thumbnail_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Radio className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        {isLive && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 text-white text-[10px] font-bold animate-pulse">● LIVE</Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          <Badge className="bg-black/70 text-white text-[10px] border-0">
            <Eye className="w-3 h-3 mr-0.5" /> {stream.viewer_count || 0}
          </Badge>
        </div>
        {stream.game_type && (
          <Badge className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] border-0">
            <Gamepad2 className="w-3 h-3 mr-0.5" /> {stream.game_type}
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-foreground text-sm truncate">{stream.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{stream.seller_name || 'Seller'}</p>
        {stream.category && <Badge variant="outline" className="text-[10px] mt-2">{stream.category}</Badge>}
      </div>
    </motion.div>
  );
}