'use client';

/**
 * Invoices Page
 * 
 * Protected route - displays all user invoices with filtering and search.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import ProtectedRoute from '@/app/components/protected-route';
import LoadingSpinner from '@/app/components/loading-spinner';
import ErrorMessage from '@/app/components/error-message';
import EmptyState from '@/app/components/empty-state';
import Link from 'next/link';
import apiClient from '@/app/lib/api-client';
import type { Invoice } from '@/app/lib/types';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.get<{ invoices: Invoice[] }>('/invoices');
      setInvoices(data.invoices || []);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError(err?.message || 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices
    .filter(inv => filter === 'all' || inv.status === filter)
    .filter(inv => 
      searchTerm === '' || 
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-primary/20 text-primary border-primary/40';
      case 'sent':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Invoices</h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage your invoices</p>
                </div>
              </div>
              <Link
                href="/invoices/create"
                className="px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-accent text-gray-900 rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                + New Invoice
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Filters & Search */}
          <div className="backdrop-blur-sm border-2 border-primary/20 rounded-xl p-4 sm:p-5 mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search invoices..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-primary text-gray-900 shadow-lg shadow-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'draft'
                    ? 'bg-primary text-gray-900 shadow-lg shadow-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setFilter('sent')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'sent'
                    ? 'bg-primary text-gray-900 shadow-lg shadow-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Sent
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'paid'
                    ? 'bg-primary text-gray-900 shadow-lg shadow-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilter('overdue')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'overdue'
                    ? 'bg-primary text-gray-900 shadow-lg shadow-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Overdue
              </button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchInvoices} />
          ) : filteredInvoices.length === 0 ? (
            <EmptyState
              title={filter === 'all' ? 'No invoices yet' : `No ${filter} invoices`}
              message={
                filter === 'all'
                  ? 'Create your first invoice to get started'
                  : `You don't have any ${filter} invoices`
              }
              actionLabel={filter === 'all' ? undefined : 'View All Invoices'}
              onAction={filter === 'all' ? undefined : () => setFilter('all')}
            />
          ) : (
            <>
              {/* Desktop Grid View */}
              <div className="hidden md:grid grid-cols-1 gap-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="group backdrop-blur-sm border-2 border-primary/20 hover:border-primary/50 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Invoice</span>
                          <span className="text-lg font-bold text-white">{invoice.invoice_number}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Client</span>
                          <span className="text-base font-semibold text-gray-300">{invoice.client_name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Issue Date</span>
                          <span className="text-sm text-gray-400">{formatDate(invoice.issue_date)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Due Date</span>
                          <span className="text-sm text-gray-400">{formatDate(invoice.due_date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Amount</span>
                          <span className="text-2xl font-bold text-primary">{formatCurrency(invoice.amount)}</span>
                        </div>
                        <span
                          className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 rounded-xl p-5 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Invoice</p>
                        <p className="text-lg font-bold text-white">{invoice.invoice_number}</p>
                        <p className="text-sm text-gray-400 mt-1">{invoice.client_name}</p>
                      </div>
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-2 ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Due Date</p>
                        <p className="text-sm text-gray-400">{formatDate(invoice.due_date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(invoice.amount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
