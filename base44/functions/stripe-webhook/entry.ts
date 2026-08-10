import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.4.0';

async function fulfillOrder(base44: any, session: any) {
  const m = session.metadata || {};

  // Idempotency: skip if order already exists for this checkout session
  const existingBySession = await base44.asServiceRole.entities.Order.filter({
    listing_id: m.listing_id
  });
  if (existingBySession.length > 0) {
    return; // Already fulfilled
  }

  const listing = await base44.asServiceRole.entities.Listing.get(m.listing_id);
  if (!listing) {
    console.error('Stripe webhook: listing not found:', m.listing_id);
    return;
  }

  await base44.asServiceRole.entities.Order.create({
    listing_id: m.listing_id,
    listing_title: listing.title || '',
    buyer_id: m.buyer_id || '',
    buyer_name: m.buyer_name || '',
    seller_id: m.seller_id || '',
    seller_name: m.seller_name || '',
    amount: parseFloat(m.final_price) || 0,
    platform_fee: parseFloat(m.platform_fee) || 0,
    seller_payout: parseFloat(m.seller_payout) || 0,
    purchase_type: m.purchase_type || 'buy_now',
    status: 'pending_shipment',
    image_url: listing.images?.[0] || '',
    shipping_cost: parseFloat(m.shipping_cost) || 0,
    shipping_rate_id: m.shipping_rate_id || '',
    carrier: m.carrier || '',
    ship_to_name: m.ship_to_name || '',
    ship_to_street1: m.ship_to_street1 || '',
    ship_to_city: m.ship_to_city || '',
    ship_to_state: m.ship_to_state || '',
    ship_to_zip: m.ship_to_zip || '',
    ship_to_country: m.ship_to_country || 'US',
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

  // Notify the seller they have a new order to ship
  try {
    await base44.asServiceRole.entities.Notification.create({
      user_id: m.seller_id || '',
      type: 'listing_sold',
      title: 'You just made a sale!',
      message: `${m.buyer_name || 'A buyer'} bought "${listing.title}" for $${parseFloat(m.final_price || 0).toFixed(2)}. Ship that shit!`,
      link: '/dashboard',
      related_id: m.listing_id,
    });
  } catch (notifError) {
    console.error('Failed to create seller notification:', notifError);
  }

  // Notify the buyer of their purchase
  try {
    await base44.asServiceRole.entities.Notification.create({
      user_id: m.buyer_id || '',
      type: 'purchase',
      title: 'Purchase complete!',
      message: `You bought "${listing.title}" for $${parseFloat(m.final_price || 0).toFixed(2)}. Sold As Is — no refunds, no crying.`,
      link: '/dashboard',
      related_id: m.listing_id,
    });
  } catch (notifError) {
    console.error('Failed to create buyer notification:', notifError);
  }
}

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
      // For async payment methods (PayPal), only fulfill if already paid.
      // Otherwise wait for async_payment_succeeded event.
      if (session.payment_status === 'paid') {
        await fulfillOrder(base44, session);
      }
    }

    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      await fulfillOrder(base44, session);
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      // Payment failed (e.g. PayPal declined) — restore the listing so it can be sold again
      const session = event.data.object;
      const m = session.metadata || {};
      if (m.listing_id) {
        const listing = await base44.asServiceRole.entities.Listing.get(m.listing_id);
        if (listing && listing.status === 'sold') {
          await base44.asServiceRole.entities.Listing.update(m.listing_id, {
            status: 'active',
            buyer_id: '',
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