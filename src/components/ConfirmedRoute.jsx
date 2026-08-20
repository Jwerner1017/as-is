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
      setSellerProfile(profiles[0] || null);
    } catch (e) {
      setSellerProfile(null);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && isAuthenticated) {
      setProfileLoading(true);
      base44.entities.SellerProfile.filter({ user_id: user.id })
        .then(profiles => setSellerProfile(profiles[0] || null))
        .catch(() => setSellerProfile(null))
        .finally(() => setProfileLoading(false));
    } else {
      setProfileLoading(false);
    }
  }, [user?.id, isAuthenticated]);

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
          <p className="text-sm text-muted-foreground text-center">Creating your seller profile…</p>
        ) : (
          <ShipFromAddress sellerProfile={sellerProfile} onSaved={reloadProfile} />
        )}
      </div>
    );
  }

  return <Outlet />;
}