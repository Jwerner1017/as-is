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
      return Response.json({ error: 'Forbidden: you can only onboard your own seller profile' }, { status: 403 });
    }

    if (profile.stripe_account_id) {
      return Response.json({
        success: true,
        stripe_account_id: profile.stripe_account_id,
        message: 'Stripe account already exists',
      });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const account = await stripe.accounts.create({
      type: 'express',
      metadata: {
        user_id: profile.user_id,
        seller_profile_id: profile.id,
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
      },
    });

    await base44.asServiceRole.entities.SellerProfile.update(profile.id, {
      stripe_account_id: account.id,
    });

    return Response.json({
      success: true,
      stripe_account_id: account.id,
      message: 'Stripe Express account created',
    });
  } catch (error) {
    console.error('Auto Stripe onboard error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});