'use client';

/**
 * All Invoices Page (Admin)
 * 
 * View all invoices across all users in the system
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import AdminRoute from '@/app/components/admin-route';
import Link from 'next/link';
import apiClient from '@/app/lib/api-client';
import type { AdminInvoiceWithUser } from '@/app/lib/types';

export default function AdminInvoicesPage() {
  const { user: currentUser, logout } = useAuth();
  const [invoices, setInvoices] = useState<AdminInvoiceWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.get<{ invoices: AdminInvoiceWithUser[] }>('/admin/invoices');
      setInvoices(data.invoices || []);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError(err.message || 'Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.user_email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const invoiceStats = {
    total: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow bg-black/40 backdrop-blur-xl border-r border-green-500/20 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 py-5 border-b border-green-500/20">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-white font-bold text-lg">Admin Panel</span>
                  <span className="block text-xs text-green-400">InvoiceApp</span>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              <Link href="/admin" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-green-600/10 hover:text-green-400 rounded-lg transition-colors border border-transparent hover:border-green-500/30">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </Link>
              <Link href="/admin/users" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-green-600/10 hover:text-green-400 rounded-lg transition-colors border border-transparent hover:border-green-500/30">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                User Management
              </Link>
              <Link href="/admin/invoices" className="flex items-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg shadow-green-500/30">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                All Invoices
              </Link>
              <Link href="/admin/settings" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-green-600/10 hover:text-green-400 rounded-lg transition-colors border border-transparent hover:border-green-500/30">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                System Settings
              </Link>
              <div className="pt-4 border-t border-green-500/20 mt-4">
                <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  User Dashboard
                </Link>
              </div>
            </nav>
            <div className="flex-shrink-0 border-t border-green-500/20 p-4">
              <div className="flex items-center px-3 py-3 mb-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/30">
                  {currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{currentUser?.email?.split('@')[0]}</p>
                  <p className="text-xs text-green-400 capitalize">{currentUser?.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-red-500/30 hover:border-red-500/50">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:pl-64">
          {/* Top Header */}
          <header className="bg-black/40 backdrop-blur-xl border-b border-green-500/20 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    All Invoices
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">System-wide invoice overview</p>
                </div>
                <button onClick={fetchInvoices} className="inline-flex items-center px-4 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-500/30">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">{invoiceStats.total}</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/30">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-gray-500/30 hover:border-gray-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Draft</p>
                    <p className="text-2xl font-bold text-white">{invoiceStats.draft}</p>
                  </div>
                  <div className="p-2 bg-gray-500/10 rounded-lg border border-gray-500/30">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Sent</p>
                    <p className="text-2xl font-bold text-white">{invoiceStats.sent}</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Paid</p>
                    <p className="text-2xl font-bold text-white">{invoiceStats.paid}</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/30">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-red-500/30 hover:border-red-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Overdue</p>
                    <p className="text-2xl font-bold text-white">{invoiceStats.overdue}</p>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-400 font-medium mb-1">Revenue</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(invoiceStats.totalRevenue)}</p>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by invoice #, client name, or user email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-green-500/60 focus:outline-none transition-colors"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                <h3 className="text-lg font-bold text-white">All Invoices ({filteredInvoices.length})</h3>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-400">{error}</div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400">No invoices found</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-green-600/5 border-b border-green-500/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Invoice</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-500/10">
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-green-600/5 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-white">{inv.invoice_number}</p>
                            <p className="text-xs text-gray-400">{formatDate(inv.issue_date)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-white">{inv.client_name}</p>
                            {inv.client_email && <p className="text-xs text-gray-400">{inv.client_email}</p>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                                {inv.user_email?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="text-xs text-gray-300">{inv.user_email || 'Unknown'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-green-400">{formatCurrency(inv.amount)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inv.status)}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {formatDate(inv.due_date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}
