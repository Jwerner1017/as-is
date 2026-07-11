import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.4.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { profile_id } = body;

    if (!profile_id) {
      return Response.json({ error: 'profile_id is required' }, { status: 400 });
    }

    const profile = await base44.asServiceRole.entities.SellerProfile.get(profile_id);
    if (!profile) {
      return Response.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    if (profile.user_id !== user.id) {
      return Response.json({ error: 'Forbidden: you can only check your own seller profile' }, { status: 403 });
    }

    if (!profile.stripe_account_id) {
      return Response.json({ onboarded: false, verified: false, message: 'No Stripe account linked' });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const account = await stripe.accounts.retrieve(profile.stripe_account_id);

    const isVerified = !!account.details_submitted;

    if (isVerified !== !!profile.onboarded) {
      await base44.asServiceRole.entities.SellerProfile.update(profile.id, {
        onboarded: isVerified,
      });
    }

    return Response.json({
      onboarded: isVerified,
      verified: isVerified,
      stripe_account_id: profile.stripe_account_id,
    });
  } catch (error) {
    console.error('Check Stripe verification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});