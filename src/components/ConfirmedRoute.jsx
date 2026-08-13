import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

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
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl text-foreground mb-2">CONFIRM YOUR INFO</h1>
        <p className="text-sm text-muted-foreground mb-6">
          You need to add your ship-from address before you can sell items. Head to your dashboard, open the Personal Info tab, and fill out the Ship-From Address section.
        </p>
        <Link to="/dashboard">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return <Outlet />;
}