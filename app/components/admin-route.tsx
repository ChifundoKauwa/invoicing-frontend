'use client';

/**
 * AdminRoute Component
 * 
 * Protects admin routes - only allows access to users with 'admin' or 'manager' roles
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import LoadingSpinner from './loading-spinner';

interface AdminRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // If true, only admin (not manager) can access
}

export default function AdminRoute({ children, requireAdmin = false }: AdminRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (requireAdmin && user.role !== 'admin') {
        // Requires admin role specifically
        router.push('/dashboard');
      } else if (!requireAdmin && user.role !== 'admin' && user.role !== 'manager') {
        // Requires admin or manager
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-green-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  if (!requireAdmin && user.role !== 'admin' && user.role !== 'manager') {
    return null;
  }

  return <>{children}</>;
}
