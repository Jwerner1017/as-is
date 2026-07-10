import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredLevel?: 'new' | 'upcoming' | 'trusted' | 'top';
}

export function ProtectedRoute({ children, requiredLevel }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredLevel) {
    const levels = ['new', 'upcoming', 'trusted', 'top'];
    const userIndex = levels.indexOf(user.sellerLevel);
    const requiredIndex = levels.indexOf(requiredLevel);

    if (userIndex < requiredIndex) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl text-red-400 mb-2">Access Denied</h2>
          <p className="text-zinc-400">You need to reach <strong>{requiredLevel}</strong> seller level to access this page.</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
