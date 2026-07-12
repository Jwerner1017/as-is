import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/reviews/StarRating';
import { Loader2 } from 'lucide-react';

export default function ReviewDialog({ order, open, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setRating(0);
    setComment('');
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      setError('Select a star rating');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await base44.functions.invoke('submit-review', {
        order_id: order.id,
        rating,
        comment
      });
      setRating(0);
      setComment('');
      onSubmitted();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">LEAVE A REVIEW</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Rate your experience with this purchase. Be blunt — sellers need the real talk.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <p className="text-xs uppercase text-muted-foreground mb-2">Rating</p>
            <StarRating rating={rating} interactive onChange={setRating} />
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground mb-2">Comment</p>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Spill the truth. Was it worth it?"
              className="bg-muted border-border min-h-[100px]"
              maxLength={1000}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading || rating < 1} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
              {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Posting</> : 'Post Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}