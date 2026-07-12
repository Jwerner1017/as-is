import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { order_id } = body;

    if (!order_id) return Response.json({ error: 'order_id required' }, { status: 400 });

    const order = await base44.asServiceRole.entities.Order.get(order_id);
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    if (order.buyer_id !== user.id) {
      return Response.json({ error: 'Forbidden: only the buyer can mark this order' }, { status: 403 });
    }

    if (order.status !== 'shipped') {
      return Response.json({ error: 'Order must be shipped before marking delivered' }, { status: 400 });
    }

    await base44.asServiceRole.entities.Order.update(order_id, {
      status: 'delivered',
      delivered_date: new Date().toISOString()
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Mark delivered error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});