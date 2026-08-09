import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const listingId = body.listing_id;

    if (!listingId) {
      return Response.json({ error: 'listing_id is required' }, { status: 400 });
    }

    const listing = await base44.asServiceRole.entities.Listing.get(listingId);
    if (!listing) {
      return Response.json({ error: 'Listing not found' }, { status: 404 });
    }
    if (!listing.auction_end) {
      return Response.json({ skipped: true, reason: 'No auction_end date' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const endDate = new Date(listing.auction_end);
    const startDate = new Date(endDate.getTime() - 60 * 1000);

    const eventRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `Listing Expiry: ${listing.title}`,
        description: `Auction ending for "${listing.title}". Listing ID: ${listingId}`,
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
        extendedProperties: {
          private: {
            listing_id: listingId,
            type: 'listing_expiration'
          }
        }
      }),
    });

    if (!eventRes.ok) {
      const errText = await eventRes.text();
      console.error('Calendar API error:', errText);
      return Response.json({ error: 'Failed to create calendar event', details: errText }, { status: 502 });
    }

    const event = await eventRes.json();
    return Response.json({ success: true, event_id: event.id, listing_id: listingId });
  } catch (error) {
    console.error('create-listing-calendar-event error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}