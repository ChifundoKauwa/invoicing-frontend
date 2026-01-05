'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/auth-context';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-gray-800 rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-64 bg-gray-950 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <Link
            href="/"
            className="px-4 py-3 text-white hover:bg-gray-800 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-3 text-white hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="px-4 py-3 text-left text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-3 text-white hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors font-semibold text-center"
                onClick={() => setIsOpen(false)}
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
