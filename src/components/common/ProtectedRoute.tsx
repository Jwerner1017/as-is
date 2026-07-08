import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredLevel?: 'new' | 'upcoming' | 'trusted' | 'top';
}

export function ProtectedRoute({ children, requiredLevel }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6">Please log in to continue.</div>;
  }

  if (requiredLevel) {
    const levels = ['new', 'upcoming', 'trusted', 'top'];
    const userLevelIndex = levels.indexOf(user.sellerLevel);
    const requiredIndex = levels.indexOf(requiredLevel);

    if (userLevelIndex < requiredIndex) {
      return <div className="p-6 text-red-400">Your seller level is too low for this page.</div>;
    }
  }

  return <>{children}</>;
}
