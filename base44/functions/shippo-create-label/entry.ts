import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { order_id, rate_id } = body;

    if (!order_id || !rate_id) {
      return Response.json({ error: 'order_id and rate_id required' }, { status: 400 });
    }

    const order = await base44.asServiceRole.entities.Order.get(order_id);
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    const response = await fetch('https://api.goshippo.com/transactions/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${Deno.env.get('SHIPPO_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rate: rate_id,
        label_file_type: 'PDF',
        async: false
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Shippo label error:', JSON.stringify(data));
      return Response.json({ error: data.detail || 'Failed to create label' }, { status: 400 });
    }

    const labelUrl = data.label_url;
    const trackingNumber = data.tracking_number;
    const carrier = data.carrier;

    await base44.asServiceRole.entities.Order.update(order_id, {
      tracking_number: trackingNumber,
      label_url: labelUrl,
      carrier: carrier,
      status: 'shipped',
      shipped_date: new Date().toISOString()
    });

    return Response.json({ label_url: labelUrl, tracking_number: trackingNumber, carrier: carrier });
  } catch (error) {
    console.error('Shippo create label error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});