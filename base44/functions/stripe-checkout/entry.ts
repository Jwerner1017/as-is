import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.4.0';

const FLAT_FEE = 0.20;
const PERCENTAGE_FEE = 0.02;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { listing_id, purchase_type, shipping_address, shipping_rate_id } = body;
    const buyer_id = user.id;
    const buyer_name = user.full_name || '';

    if (!listing_id) return Response.json({ error: 'listing_id required' }, { status: 400 });

    const listing = await base44.asServiceRole.entities.Listing.get(listing_id);
    if (!listing) return Response.json({ error: 'Listing not found' }, { status: 404 });
    if (listing.status === 'sold') return Response.json({ error: 'Listing already sold' }, { status: 400 });
    if (listing.status === 'ended') return Response.json({ error: 'Listing has ended' }, { status: 400 });

    // Prevent sellers from buying their own listings
    if (listing.seller_id === buyer_id) {
      return Response.json({ error: 'You cannot buy your own listing' }, { status: 400 });
    }

    // Validate purchase_type against the listing's selling_format
    const isBuyNow = listing.selling_format === 'Buy It Now';
    const isAuctionOrLive = listing.selling_format === 'Auction' || listing.selling_format === 'Live';
    const displayPrice = isAuctionOrLive ? (listing.current_bid || listing.starting_bid || 0) : listing.price;

    let finalPrice = 0;
    if (isBuyNow) {
      if (purchase_type !== 'buy_now') {
        return Response.json({ error: 'This listing can only be purchased via Buy It Now' }, { status: 400 });
      }
      finalPrice = listing.price;
    } else if (isAuctionOrLive) {
      if (purchase_type === 'rage_buy') {
        // Rage Buy eligibility: 15+ bids OR manually triggered by seller
        const rageEligible = (listing.bid_count >= 15) || listing.rage_buy_triggered_manually;
        if (!rageEligible) {
          return Response.json({ error: 'Rage Buy is not available for this listing' }, { status: 400 });
        }
        finalPrice = displayPrice * 1.20;
      } else if (purchase_type === 'all_mine') {
        // All Mine eligibility: must be active and not expired
        const allMineExpired = listing.all_mine_expires && new Date(listing.all_mine_expires) <= new Date();
        if (!listing.all_mine_active || allMineExpired) {
          return Response.json({ error: 'All Mine is not available for this listing' }, { status: 400 });
        }
        finalPrice = displayPrice * 1.25;
      } else {
        return Response.json({ error: 'Auction listings can only be purchased via Rage Buy or All Mine' }, { status: 400 });
      }
    } else {
      return Response.json({ error: 'Unknown selling format' }, { status: 400 });
    }

    finalPrice = Math.round(finalPrice * 100) / 100;

    // Atomically reserve the listing — only succeeds if buyer_id is not already
    // claimed by another buyer. This prevents concurrent checkout sessions.
    await base44.asServiceRole.entities.Listing.updateMany(
      { id: listing_id, buyer_id: { $in: [null, ""] } },
      { $set: { buyer_id: buyer_id } }
    );
    const reservedListing = await base44.asServiceRole.entities.Listing.get(listing_id);
    if (reservedListing.buyer_id !== buyer_id) {
      return Response.json({ error: 'Listing is being purchased by another buyer. Please try again.' }, { status: 409 });
    }

    // Validate shipping cost server-side — never trust client-supplied shipping_cost
    let validatedShippingCost = 0;
    let validatedCarrier = '';
    if (listing.shipping_type === 'Free Shipping') {
      validatedShippingCost = 0;
    } else if (listing.shipping_type === 'Flat Rate') {
      validatedShippingCost = listing.shipping_cost || 0;
    } else if (listing.shipping_type === 'Calculated') {
      if (!shipping_rate_id) {
        return Response.json({ error: 'Shipping rate selection required for calculated shipping' }, { status: 400 });
      }
      if (!shipping_address?.zip || !shipping_address?.state) {
        return Response.json({ error: 'Shipping address required for calculated shipping' }, { status: 400 });
      }
      const rateRes = await fetch(`https://api.goshippo.com/rates/${encodeURIComponent(shipping_rate_id)}`, {
        headers: { 'Authorization': `ShippoToken ${Deno.env.get('SHIPPO_API_KEY')}` }
      });
      const rateData = await rateRes.json();
      if (!rateRes.ok || !rateData.amount) {
        console.error('Shippo rate validation error:', JSON.stringify(rateData));
        return Response.json({ error: 'Invalid or expired shipping rate' }, { status: 400 });
      }
      validatedShippingCost = parseFloat(rateData.amount);
      if (isNaN(validatedShippingCost) || validatedShippingCost < 0) {
        return Response.json({ error: 'Invalid shipping rate amount' }, { status: 400 });
      }
      validatedCarrier = rateData.carrier || '';
    }

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
      payment_method_types: ['card', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: listing.title,
              description: listing.description?.substring(0, 200) || undefined,
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
        ...(validatedShippingCost > 0 ? [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Shipping' },
            unit_amount: Math.round(validatedShippingCost * 100),
          },
          quantity: 1,
        }] : [])
      ],
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
        shipping_cost: validatedShippingCost.toString(),
        shipping_rate_id: shipping_rate_id || '',
        carrier: validatedCarrier,
        ship_to_name: shipping_address?.name || '',
        ship_to_street1: shipping_address?.street1 || '',
        ship_to_city: shipping_address?.city || '',
        ship_to_state: shipping_address?.state || '',
        ship_to_zip: shipping_address?.zip || '',
        ship_to_country: shipping_address?.country || 'US',
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});