import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.4.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const origin = new URL(req.url).origin;

    const profiles = await base44.entities.SellerProfile.filter({ user_id: user.id });
    let profile = profiles[0];

    if (!profile) {
      return Response.json({ error: 'Seller profile not found. Complete onboarding first.' }, { status: 400 });
    }

    if (!profile.stripe_account_id) {
      const account = await stripe.accounts.create({
        type: 'express',
        metadata: { user_id: user.id, seller_profile_id: profile.id },
      });
      profile = await base44.entities.SellerProfile.update(profile.id, {
        stripe_account_id: account.id,
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${origin}/dashboard?stripe_refresh=1`,
      return_url: `${origin}/dashboard?stripe_return=1`,
      type: 'account_onboarding',
    });

    return Response.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe onboarding error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});