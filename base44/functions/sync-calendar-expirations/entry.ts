import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    const now = new Date();
    const timeMin = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    const timeMax = now.toISOString();

    let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`;

    const allItems = [];
    let res = await fetch(url, { headers: authHeader });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Calendar API error:', errText);
      return Response.json({ error: 'Calendar API error', details: errText }, { status: 502 });
    }
    let pageData = await res.json();
    while (true) {
      allItems.push(...(pageData.items || []));
      if (!pageData.nextPageToken) break;
      const nextRes = await fetch(url + `&pageToken=${pageData.nextPageToken}`, { headers: authHeader });
      if (!nextRes.ok) break;
      pageData = await nextRes.json();
    }

    const expiredListings = [];
    for (const item of allItems) {
      const listingId = item.extendedProperties?.private?.listing_id;
      if (!listingId) continue;

      const endTime = item.end?.dateTime ? new Date(item.end.dateTime) : null;
      if (!endTime || endTime >= now) continue;

      try {
        const listing = await base44.asServiceRole.entities.Listing.get(listingId);
        if (listing && listing.status === 'active') {
          await base44.asServiceRole.entities.Listing.update(listingId, { status: 'ended' });
          expiredListings.push({ listing_id: listingId, title: listing.title });
        }
      } catch (e) {
        console.log(`Listing ${listingId} not found or already processed`);
      }
    }

    return Response.json({
      success: true,
      events_scanned: allItems.length,
      listings_expired: expiredListings.length,
      expired_listings: expiredListings
    });
  } catch (error) {
    console.error('sync-calendar-expirations error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}