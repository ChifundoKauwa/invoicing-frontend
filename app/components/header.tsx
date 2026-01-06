'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/contexts/auth-context';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Don't show header on dashboard pages as they have their own navigation
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/invoices')) {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              <span className="text-primary">Invoice</span>
              <span className="text-white">Flow</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-primary font-sans text-base font-semibold transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="bg-primary hover:bg-primary-accent text-gray-900 px-6 py-2.5 rounded-full font-sans text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Login
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="bg-primary hover:bg-primary-accent text-gray-900 px-6 py-2.5 rounded-full font-sans text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-primary font-sans text-base font-semibold py-2 px-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-primary hover:bg-primary-accent text-gray-900 px-6 py-2.5 rounded-full font-sans text-sm font-semibold transition-all text-center"
                >
                  Login
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-primary hover:bg-primary-accent text-gray-900 px-6 py-2.5 rounded-full font-sans text-sm font-semibold transition-all text-center"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
