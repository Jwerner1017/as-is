import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { order_id, rating, comment } = body;

    if (!order_id || !rating || rating < 1 || rating > 5) {
      return Response.json({ error: 'order_id and rating (1-5) required' }, { status: 400 });
    }

    const order = await base44.asServiceRole.entities.Order.get(order_id);
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    if (order.buyer_id !== user.id) {
      return Response.json({ error: 'Forbidden: only the buyer can review this order' }, { status: 403 });
    }

    if (order.status !== 'delivered') {
      return Response.json({ error: 'Order must be delivered before reviewing' }, { status: 400 });
    }

    const existing = await base44.asServiceRole.entities.Review.filter({ order_id, buyer_id: user.id });
    if (existing.length > 0) {
      return Response.json({ error: 'You have already reviewed this order' }, { status: 400 });
    }

    await base44.asServiceRole.entities.Review.create({
      order_id,
      listing_id: order.listing_id,
      listing_title: order.listing_title,
      buyer_id: user.id,
      buyer_name: user.full_name || '',
      seller_id: order.seller_id,
      rating: Math.round(rating),
      comment: (comment || '').substring(0, 1000)
    });

    const allReviews = await base44.asServiceRole.entities.Review.filter({ seller_id: order.seller_id });
    const reviewCount = allReviews.length;
    const avgRating = reviewCount > 0
      ? Math.round((allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount) * 10) / 10
      : 0;

    const sellerProfiles = await base44.asServiceRole.entities.SellerProfile.filter({ user_id: order.seller_id });
    if (sellerProfiles[0]) {
      await base44.asServiceRole.entities.SellerProfile.update(sellerProfiles[0].id, {
        rating: avgRating,
        review_count: reviewCount
      });
    }

    return Response.json({ success: true, rating: avgRating, review_count: reviewCount });
  } catch (error) {
    console.error('Submit review error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});