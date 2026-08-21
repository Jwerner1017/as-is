import { useEffect, useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { MapPin } from 'lucide-react';
import ShipFromAddress from '@/components/shipping/ShipFromAddress';

export function LoginRedirect() {
  const { navigateToLogin } = useAuth();
  useEffect(() => { navigateToLogin(); }, [navigateToLogin]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}

export default function ConfirmedRoute() {
  const { user, isAuthenticated, isLoadingAuth, authChecked, authError } = useAuth();
  const [sellerProfile, setSellerProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const reloadProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      const profiles = await base44.entities.SellerProfile.filter({ user_id: user.id });
      // Prefer a profile that already has a ship-from address (guards against
      // duplicate profiles where an older one lacks the address).
      let profile = profiles.find(p => p.ship_from_street1) || profiles[0] || null;
      if (!profile) {
        profile = await base44.entities.SellerProfile.create({
          user_id: user.id,
          display_name: user.full_name || 'New Seller'
        });
      }
      setSellerProfile(profile);
    } catch (e) {
      setSellerProfile(null);
    }
  }, [user?.id, user?.full_name]);

  // Apply the saved profile immediately so the user proceeds without waiting
  // on a re-fetch (which could return a stale or duplicate record).
  const handleAddressSaved = useCallback((updatedProfile) => {
    if (updatedProfile) setSellerProfile(updatedProfile);
    reloadProfile();
  }, [reloadProfile]);

  useEffect(() => {
    if (user?.id && isAuthenticated) {
      setProfileLoading(true);
      reloadProfile().finally(() => setProfileLoading(false));
    } else {
      setProfileLoading(false);
    }
  }, [user?.id, isAuthenticated, reloadProfile]);

  if (isLoadingAuth || !authChecked || profileLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || authError) {
    return <LoginRedirect />;
  }

  if (!sellerProfile?.ship_from_street1) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl text-foreground mb-2 text-center">CONFIRM YOUR INFO</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Add your ship-from address below to continue. It's required for shipping labels.
        </p>
        {!sellerProfile ? (
          <p className="text-sm text-muted-foreground text-center">Setting up your seller profile…</p>
        ) : (
          <ShipFromAddress sellerProfile={sellerProfile} onSaved={handleAddressSaved} />
        )}
      </div>
    );
  }

  return <Outlet />;
}