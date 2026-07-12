import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { order_ids } = body;

    if (!Array.isArray(order_ids) || order_ids.length === 0) {
      return Response.json({ error: 'order_ids array required' }, { status: 400 });
    }

    // Get seller profile once
    const profiles = await base44.asServiceRole.entities.SellerProfile.filter({ user_id: user.id });
    const sellerProfile = profiles[0];
    if (!sellerProfile?.ship_from_street1) {
      return Response.json({ error: 'You must set up your ship-from address first' }, { status: 400 });
    }

    const results = [];

    for (const orderId of order_ids) {
      try {
        const order = await base44.asServiceRole.entities.Order.get(orderId);
        if (!order) {
          results.push({ order_id: orderId, success: false, error: 'Order not found' });
          continue;
        }

        if (order.seller_id !== user.id) {
          results.push({ order_id: orderId, success: false, error: 'Forbidden' });
          continue;
        }

        if (order.status !== 'pending_shipment') {
          results.push({ order_id: orderId, success: false, error: 'Order is not pending shipment' });
          continue;
        }

        if (!order.ship_to_street1) {
          results.push({ order_id: orderId, success: false, error: 'No shipping address on order' });
          continue;
        }

        const listing = await base44.asServiceRole.entities.Listing.get(order.listing_id);
        if (!listing) {
          results.push({ order_id: orderId, success: false, error: 'Listing not found' });
          continue;
        }

        if (!listing.weight || !listing.length || !listing.width || !listing.height) {
          results.push({ order_id: orderId, success: false, error: 'Listing missing package dimensions' });
          continue;
        }

        // Get rates
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
            name: order.ship_to_name || 'Buyer',
            street1: order.ship_to_street1,
            city: order.ship_to_city,
            state: order.ship_to_state,
            zip: order.ship_to_zip,
            country: order.ship_to_country || 'US'
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

        const rateResponse = await fetch('https://api.goshippo.com/shipments/', {
          method: 'POST',
          headers: {
            'Authorization': `ShippoToken ${Deno.env.get('SHIPPO_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(shipmentData)
        });

        const rateData = await rateResponse.json();
        if (!rateResponse.ok) {
          console.error('Rate fetch error for order', orderId, JSON.stringify(rateData));
          results.push({ order_id: orderId, success: false, error: rateData.detail || 'Failed to get rates' });
          continue;
        }

        const rates = (rateData.rates || []).filter(r => r.object_id);
        if (rates.length === 0) {
          results.push({ order_id: orderId, success: false, error: 'No rates available' });
          continue;
        }

        // Pick cheapest rate
        const cheapest = rates.reduce((min, r) =>
          parseFloat(r.amount) < parseFloat(min.amount) ? r : min
        , rates[0]);

        // Purchase label
        const labelResponse = await fetch('https://api.goshippo.com/transactions/', {
          method: 'POST',
          headers: {
            'Authorization': `ShippoToken ${Deno.env.get('SHIPPO_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rate: cheapest.object_id,
            label_file_type: 'PDF',
            async: false
          })
        });

        const labelData = await labelResponse.json();
        if (!labelResponse.ok) {
          console.error('Label creation error for order', orderId, JSON.stringify(labelData));
          results.push({ order_id: orderId, success: false, error: labelData.detail || 'Failed to create label' });
          continue;
        }

        // Update order
        await base44.asServiceRole.entities.Order.update(orderId, {
          tracking_number: labelData.tracking_number,
          label_url: labelData.label_url,
          carrier: labelData.carrier,
          status: 'shipped',
          shipped_date: new Date().toISOString()
        });

        // Send email to buyer
        try {
          const buyer = await base44.asServiceRole.entities.User.get(order.buyer_id);
          if (buyer?.email) {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: buyer.email,
              subject: `Your AS IS order has shipped!`,
              body: `Your order "${order.listing_title}" has been shipped.\n\nTracking: ${labelData.tracking_number}\nCarrier: ${labelData.carrier || 'N/A'}\n\nYou'll receive updates as your package moves. No refunds. No crying. Just deals.`
            });
          }
        } catch (emailError) {
          console.error('Failed to send shipping email:', emailError);
        }

        results.push({
          order_id: orderId,
          success: true,
          tracking_number: labelData.tracking_number,
          label_url: labelData.label_url,
          carrier: labelData.carrier
        });
      } catch (err) {
        results.push({ order_id: orderId, success: false, error: err.message });
      }
    }

    const succeeded = results.filter(r => r.success).length;
    const failed = results.length - succeeded;

    return Response.json({ results, succeeded, failed });
  } catch (error) {
    console.error('Bulk label error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});