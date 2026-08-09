import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const orderId = body.order_id;

    if (!orderId) {
      return Response.json({ error: 'order_id is required' }, { status: 400 });
    }

    const order = await base44.asServiceRole.entities.Order.get(orderId);
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Ship-by deadline: 2 days from order creation
    const createdDate = new Date(order.created_date);
    const shipByDate = new Date(createdDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    const shipByDateStr = shipByDate.toISOString().split('T')[0];

    const eventRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `Ship Deadline: ${order.listing_title}`,
        description: `Ship-by deadline for order of "${order.listing_title}".\n\nBuyer: ${order.buyer_name || 'N/A'}\nAmount: $${order.amount}\nOrder ID: ${orderId}\n\nShip the item today to meet the deadline!`,
        start: { date: shipByDateStr },
        end: { date: shipByDateStr },
        extendedProperties: {
          private: {
            order_id: orderId,
            type: 'ship_deadline'
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 60 }
          ]
        }
      }),
    });

    if (!eventRes.ok) {
      const errText = await eventRes.text();
      console.error('Calendar API error:', errText);
      return Response.json({ error: 'Failed to create calendar event', details: errText }, { status: 502 });
    }

    const event = await eventRes.json();
    return Response.json({ success: true, event_id: event.id, order_id: orderId, ship_by: shipByDateStr });
  } catch (error) {
    console.error('create-order-ship-deadline error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}