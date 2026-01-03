import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function Layout({ children, requireAuth = true }: LayoutProps) {
  const { isLoggedIn } = useAuth();

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {requireAuth && <Navigation />}
      <main className={requireAuth ? 'animate-fade-in' : ''}>
        {children}
      </main>
    </div>
  );
}
