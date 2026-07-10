import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.4.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !secret) {
      return Response.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    const event = await stripe.webhooks.constructEventAsync(body, signature, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const m = session.metadata || {};

      // Idempotency: skip if order already exists
      const existingOrders = await base44.asServiceRole.entities.Order.filter({ listing_id: m.listing_id });
      if (existingOrders.length === 0) {
        const listing = await base44.asServiceRole.entities.Listing.get(m.listing_id);

        await base44.asServiceRole.entities.Order.create({
          listing_id: m.listing_id,
          listing_title: listing?.title || '',
          buyer_id: m.buyer_id || '',
          buyer_name: m.buyer_name || '',
          seller_id: m.seller_id || '',
          seller_name: m.seller_name || '',
          amount: parseFloat(m.final_price) || 0,
          platform_fee: parseFloat(m.platform_fee) || 0,
          seller_payout: parseFloat(m.seller_payout) || 0,
          purchase_type: m.purchase_type || 'buy_now',
          status: 'pending_shipment',
          image_url: listing?.images?.[0] || '',
        });

        await base44.asServiceRole.entities.Listing.update(m.listing_id, {
          status: 'sold',
          final_price: parseFloat(m.final_price) || 0,
          buyer_id: m.buyer_id || '',
          sold_date: new Date().toISOString(),
        });

        // Update seller stats
        const sellerProfiles = await base44.asServiceRole.entities.SellerProfile.filter({ user_id: m.seller_id });
        if (sellerProfiles[0]) {
          await base44.asServiceRole.entities.SellerProfile.update(sellerProfiles[0].id, {
            total_sales: (sellerProfiles[0].total_sales || 0) + 1,
            total_revenue: (sellerProfiles[0].total_revenue || 0) + (parseFloat(m.seller_payout) || 0),
          });
        }
      }
    }

    if (event.type === 'account.updated') {
      const account = event.data.object;
      const profiles = await base44.asServiceRole.entities.SellerProfile.filter({ stripe_account_id: account.id });
      if (profiles[0]) {
        await base44.asServiceRole.entities.SellerProfile.update(profiles[0].id, {
          onboarded: account.details_submitted,
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});