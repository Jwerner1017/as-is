import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.4.0';

const FLAT_FEE = 0.20;
const PERCENTAGE_FEE = 0.02;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { listing_id, buyer_id, buyer_name, purchase_type } = body;

    if (!listing_id) return Response.json({ error: 'listing_id required' }, { status: 400 });

    const listing = await base44.asServiceRole.entities.Listing.get(listing_id);
    if (!listing) return Response.json({ error: 'Listing not found' }, { status: 404 });
    if (listing.status === 'sold') return Response.json({ error: 'Listing already sold' }, { status: 400 });

    const isAuction = listing.selling_format === 'Auction';
    const displayPrice = isAuction ? (listing.current_bid || listing.starting_bid || 0) : listing.price;

    let finalPrice = 0;
    if (purchase_type === 'buy_now') finalPrice = listing.price;
    else if (purchase_type === 'rage_buy') finalPrice = displayPrice * 1.20;
    else if (purchase_type === 'all_mine') finalPrice = displayPrice * 1.25;
    else finalPrice = displayPrice;

    finalPrice = Math.round(finalPrice * 100) / 100;

    const sellerProfiles = await base44.asServiceRole.entities.SellerProfile.filter({ user_id: listing.seller_id });
    const sellerProfile = sellerProfiles[0];

    if (!sellerProfile?.stripe_account_id) {
      return Response.json({ error: 'Seller has not set up payouts yet.' }, { status: 400 });
    }

    const platformFee = Math.round((FLAT_FEE + finalPrice * PERCENTAGE_FEE) * 100) / 100;
    const sellerPayout = Math.round((finalPrice - platformFee) * 100) / 100;

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: listing.title,
            description: listing.description?.substring(0, 200) || undefined,
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/listing/${listing_id}?payment=success`,
      cancel_url: `${origin}/listing/${listing_id}?payment=cancelled`,
      transfer_data: {
        destination: sellerProfile.stripe_account_id,
        amount: Math.round(sellerPayout * 100),
      },
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        listing_id,
        buyer_id: buyer_id || '',
        buyer_name: buyer_name || '',
        seller_id: listing.seller_id || '',
        seller_name: listing.seller_name || '',
        purchase_type: purchase_type || '',
        final_price: finalPrice.toString(),
        platform_fee: platformFee.toString(),
        seller_payout: sellerPayout.toString(),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});