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
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Subtle gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-blue-950/20 pointer-events-none"></div>

        {/* Header */}
        <header className="relative bg-white/5 backdrop-blur-md border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Invoices</h1>
              </div>
              <Link
                href="/invoices/create"
                className="px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-full hover:from-green-500 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                + New Invoice
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Filters */}
          <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-4 sm:p-5 mb-6">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'draft'
                    ? 'bg-blue-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setFilter('sent')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'sent'
                    ? 'bg-blue-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Sent
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'paid'
                    ? 'bg-blue-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilter('overdue')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === 'overdue'
                    ? 'bg-blue-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50 border-b border-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-700/30 transition-colors cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {invoice.client_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(invoice.issue_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(invoice.due_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-700/50">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-5 hover:bg-gray-700/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {invoice.invoice_number}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">{invoice.client_name}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(invoice.amount)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Due: {formatDate(invoice.due_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
