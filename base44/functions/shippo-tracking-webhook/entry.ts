import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Shippo tracking webhook payload: { event, data: { tracking_number, tracking_status: { status, substatus, ... } } }
    const { data } = body;

    if (!data?.tracking_number) {
      return Response.json({ error: 'No tracking number in payload' }, { status: 400 });
    }

    // Find the order by tracking number
    const orders = await base44.asServiceRole.entities.Order.filter({
      tracking_number: data.tracking_number
    });

    if (orders.length === 0) {
      return Response.json({ error: 'Order not found for this tracking number' }, { status: 404 });
    }

    const order = orders[0];
    const trackingStatus = data.tracking_status?.status || '';
    const substatus = data.tracking_status?.substatus || '';

    let emailSubject = '';
    let emailBody = '';
    let newOrderStatus = null;

    if (substatus === 'out_for_delivery') {
      emailSubject = `Your AS IS package is out for delivery!`;
      emailBody = `Good news! Your order "${order.listing_title}" is out for delivery today.\n\nTracking: ${data.tracking_number}\nCarrier: ${order.carrier || 'N/A'}\n\nKeep an eye out — it's coming your way.`;
    } else if (trackingStatus === 'transit') {
      emailSubject = `Your AS IS package is on the move`;
      emailBody = `Your order "${order.listing_title}" is now in transit.\n\nTracking: ${data.tracking_number}\nCarrier: ${order.carrier || 'N/A'}\n\nSit tight — it'll be there soon.`;
    } else if (trackingStatus === 'delivered') {
      emailSubject = `Your AS IS package has been delivered!`;
      emailBody = `Your order "${order.listing_title}" has been delivered. You can now mark it delivered and leave a review from your dashboard.\n\nTracking: ${data.tracking_number}\nCarrier: ${order.carrier || 'N/A'}\n\nThanks for shopping on AS IS. No refunds. No crying. Just deals.`;
      newOrderStatus = 'delivered';
    } else {
      return Response.json({ success: true, message: `No email needed for status: ${trackingStatus}` });
    }

    // Update order status if applicable
    if (newOrderStatus && newOrderStatus !== order.status) {
      await base44.asServiceRole.entities.Order.update(order.id, {
        status: newOrderStatus,
        ...(newOrderStatus === 'delivered' ? { delivered_date: new Date().toISOString() } : {})
      });
    }

    // Send email to buyer
    try {
      const buyer = await base44.asServiceRole.entities.User.get(order.buyer_id);
      if (buyer?.email) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: buyer.email,
          subject: emailSubject,
          body: emailBody
        });
      }
    } catch (emailError) {
      console.error('Failed to send tracking email:', emailError);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Shippo tracking webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});