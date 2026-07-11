import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { listing_id, ship_to_name, ship_to_street1, ship_to_city, ship_to_state, ship_to_zip, ship_to_country } = body;

    if (!listing_id) return Response.json({ error: 'listing_id required' }, { status: 400 });
    if (!ship_to_zip || !ship_to_state) return Response.json({ error: 'Shipping address required' }, { status: 400 });

    const listing = await base44.asServiceRole.entities.Listing.get(listing_id);
    if (!listing) return Response.json({ error: 'Listing not found' }, { status: 404 });

    if (!listing.weight || !listing.length || !listing.width || !listing.height) {
      return Response.json({ error: 'Listing missing package dimensions' }, { status: 400 });
    }

    const profiles = await base44.asServiceRole.entities.SellerProfile.filter({ user_id: listing.seller_id });
    const sellerProfile = profiles[0];
    if (!sellerProfile?.ship_from_street1) {
      return Response.json({ error: 'Seller has not set up their ship-from address' }, { status: 400 });
    }

    const shipmentData = {
      address_from: {
        name: sellerProfile.ship_from_name || sellerProfile.display_name,
        street1: sellerProfile.ship_from_street1,
        city: sellerProfile.ship_from_city,
        state: sellerProfile.ship_from_state,
        zip: sellerProfile.ship_from_zip,
        country: 'US'
      },
      address_to: {
        name: ship_to_name || 'Buyer',
        street1: ship_to_street1,
        city: ship_to_city,
        state: ship_to_state,
        zip: ship_to_zip,
        country: ship_to_country || 'US'
      },
      parcels: [{
        length: String(listing.length),
        width: String(listing.width),
        height: String(listing.height),
        distance_unit: listing.distance_unit || 'in',
        weight: String(listing.weight),
        mass_unit: listing.mass_unit || 'lb'
      }],
      async: false
    };

    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${Deno.env.get('SHIPPO_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shipmentData)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Shippo error:', JSON.stringify(data));
      return Response.json({ error: data.detail || 'Failed to get rates' }, { status: 400 });
    }

    const rates = (data.rates || [])
      .filter(r => r.object_id)
      .map(r => ({
        object_id: r.object_id,
        amount: parseFloat(r.amount),
        currency: r.currency,
        carrier: r.carrier,
        servicelevel_name: r.servicelevel?.name,
        servicelevel_token: r.servicelevel?.token,
        estimated_days: r.estimated_days,
        duration_terms: r.duration_terms
      }));

    return Response.json({ rates, shipment_id: data.object_id });
  } catch (error) {
    console.error('Shippo get rates error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});