import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { order_id, tracking_number } = body;

    if (!order_id || !tracking_number || typeof tracking_number !== 'string') {
      return Response.json({ error: 'order_id and tracking_number required' }, { status: 400 });
    }

    const order = await base44.asServiceRole.entities.Order.get(order_id);
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    if (order.seller_id !== user.id) {
      return Response.json({ error: 'Forbidden: only the seller can update this order' }, { status: 403 });
    }

    if (order.status !== 'pending_shipment') {
      return Response.json({ error: 'Order cannot be shipped from its current state' }, { status: 400 });
    }

    await base44.asServiceRole.entities.Order.update(order_id, {
      status: 'shipped',
      tracking_number: tracking_number,
      shipped_date: new Date().toISOString()
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Update order shipped error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});