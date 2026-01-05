'use client';

/**
 * Dashboard Page
 * 
 * Protected route - comprehensive dashboard with stats, charts, and recent invoices.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import ProtectedRoute from '@/app/components/protected-route';
import Link from 'next/link';
import apiClient from '@/app/lib/api-client';
import type { Invoice } from '@/app/lib/types';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await apiClient.get<{ invoices: Invoice[] }>('/invoices');
      setInvoices(data.invoices || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Calculate stats
  const totalInvoices = invoices.length;
  const outstandingAmount = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const paidThisMonth = invoices
    .filter(inv => {
      const paidDate = new Date(inv.updated_at);
      const now = new Date();
      return inv.status === 'paid' && 
             paidDate.getMonth() === now.getMonth() &&
             paidDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, inv) => sum + inv.amount, 0);
  const upcomingPayments = invoices.filter(inv => 
    inv.status === 'sent' && new Date(inv.due_date) > new Date()
  ).length;

  // Status counts for chart
  const statusCounts = {
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow bg-black/40 backdrop-blur-xl border-r border-gray-800 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IA</span>
                </div>
                <span className="text-white font-bold text-lg">InvoiceApp</span>
              </div>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link href="/invoices" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Invoices
              </Link>
              <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Payments
              </button>
              <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Clients
              </button>
              <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Reports
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">PRO</span>
              </button>
            </nav>
            <div className="flex-shrink-0 border-t border-gray-800 p-4">
              <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors relative">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">3</span>
              </button>
              <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors mt-1">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors mt-1">
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
          <header className="bg-black/40 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome {user?.email?.split('@')[0] || 'back'}!</h1>
                  <p className="text-sm text-gray-400 mt-1">Overview</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <Link href="/invoices" className="inline-flex items-center px-4 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 hover:-translate-y-0.5">
                    + Create Invoice
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all backdrop-blur-sm bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-400 font-medium mb-2">Total invoice</p>
                <p className="text-4xl font-bold text-white">{totalInvoices}</p>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all backdrop-blur-sm bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-400 font-medium mb-2">Outstanding Amounts</p>
                <p className="text-4xl font-bold text-white">{formatCurrency(outstandingAmount)}</p>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all backdrop-blur-sm bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-400 font-medium mb-2">Paid this month</p>
                <p className="text-4xl font-bold text-white">{formatCurrency(paidThisMonth)}</p>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all backdrop-blur-sm bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-400 font-medium mb-2">Upcoming Payments</p>
                <p className="text-4xl font-bold text-white">{upcomingPayments}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Cashflow Summary */}
              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 backdrop-blur-sm bg-black/20">
                <h3 className="text-lg font-semibold text-white mb-1">Cashflow summary</h3>
                <p className="text-sm text-gray-400 mb-6">Last 6 Month</p>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[65, 85, 70, 90, 75, 95].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg hover:from-green-400 hover:to-emerald-300 transition-all" style={{height: `${height}%`}}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>

              {/* Invoice by Amount */}
              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 backdrop-blur-sm bg-black/20">
                <h3 className="text-lg font-semibold text-white mb-1">Invoice by Amount</h3>
                <p className="text-sm text-gray-400 mb-6">Status Distribution</p>
                <div className="h-48 flex items-end justify-around gap-4">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full bg-gray-600 rounded-t-lg transition-all hover:bg-gray-500" style={{height: `${(statusCounts.draft / Math.max(...Object.values(statusCounts), 1)) * 100}%`, minHeight: '20px'}}></div>
                    <span className="text-xs text-gray-400 mt-2">Draft</span>
                    <span className="text-xs font-semibold text-white">{statusCounts.draft}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full bg-blue-700 rounded-t-lg transition-all hover:bg-blue-900" style={{height: `${(statusCounts.sent / Math.max(...Object.values(statusCounts), 1)) * 100}%`, minHeight: '20px'}}></div>
                    <span className="text-xs text-gray-400 mt-2">Sent</span>
                    <span className="text-xs font-semibold text-white">{statusCounts.sent}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-400" style={{height: `${(statusCounts.paid / Math.max(...Object.values(statusCounts), 1)) * 100}%`, minHeight: '20px'}}></div>
                    <span className="text-xs text-gray-400 mt-2">Paid</span>
                    <span className="text-xs font-semibold text-white">{statusCounts.paid}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full bg-red-500 rounded-t-lg transition-all hover:bg-red-400" style={{height: `${(statusCounts.overdue / Math.max(...Object.values(statusCounts), 1)) * 100}%`, minHeight: '20px'}}></div>
                    <span className="text-xs text-gray-400 mt-2">Overdue</span>
                    <span className="text-xs font-semibold text-white">{statusCounts.overdue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
                  <p className="text-sm text-gray-400">Latest invoice activities</p>
                </div>
                <Link href="/invoices" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-green-500/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Invoice#</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Amount($)</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-500/10">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading invoices...</td>
                      </tr>
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No invoices yet. Create your first invoice to get started!</td>
                      </tr>
                    ) : (
                      invoices.slice(0, 5).map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-white">{invoice.invoice_number}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{invoice.client_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{formatDate(invoice.issue_date)}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{formatDate(invoice.due_date)}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-white">{formatCurrency(invoice.amount)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
