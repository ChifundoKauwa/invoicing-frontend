'use client';


 //Landing page that redirects authenticated users to dashboard,
 
 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/auth-context';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 py-12 sm:py-16 pt-24 sm:pt-32">
      <div className="max-w-3xl w-full text-center">
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4 px-2">
          Build invoices in minutes,
          <span className="block text-blue-500 mt-2">scale your billing with ease.</span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
          Modern invoicing for freelancers and small businesses. Create, send, and track
          payments in a clean, focused dashboard connected to your backend API.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 sm:px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95"
          >
            Sign in to your workspace
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-gray-700 bg-gray-900/60 px-6 sm:px-8 py-3 text-sm font-semibold text-gray-200 hover:border-gray-500 hover:bg-gray-900 transition-colors active:scale-95"
          >
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
}
