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
  const { isAuthenticated, isLoadingAuth, authChecked, authError } = useAuth();
  const [checking, setChecking] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    async function check() {
      if (authChecked && !isLoadingAuth) {
        if (!isAuthenticated || authError) {
          setChecking(false);
          return;
        }
        try {
          const u = await base44.auth.me();
          setConfirmed(!!u?.default_ship_street1);
        } catch {
          setConfirmed(false);
        }
        setChecking(false);
      }
    }
    check();
  }, [authChecked, isLoadingAuth, isAuthenticated, authError]);

  if (isLoadingAuth || !authChecked || checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || authError) {
    return <LoginRedirect />;
  }

  if (!confirmed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl text-foreground mb-2">CONFIRM YOUR INFO</h1>
        <p className="text-sm text-muted-foreground mb-6">
          You need to add your shipping address before you can access this page.
          Head to your dashboard and fill out the Personal Info tab.
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