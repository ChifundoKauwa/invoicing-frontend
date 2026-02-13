'use client';

/**
 * Admin Dashboard Page
 * 
 * Main admin/manager dashboard with system statistics, user management, and invoice overview
 * Features beautiful green-bordered cards with modern, responsive design
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import AdminRoute from '@/app/components/admin-route';
import Link from 'next/link';
import apiClient from '@/app/lib/api-client';
import type { SystemStats, UserWithInvoices, AdminInvoiceWithUser } from '@/app/lib/types';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserWithInvoices[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<AdminInvoiceWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch system stats
      const statsData = await apiClient.get<SystemStats>('/admin/stats');
      setStats(statsData);

      // Fetch recent users
      const usersData = await apiClient.get<{ users: UserWithInvoices[] }>('/admin/users?limit=5');
      setRecentUsers(usersData.users || []);

      // Fetch recent invoices across all users
      const invoicesData = await apiClient.get<{ invoices: AdminInvoiceWithUser[] }>('/admin/invoices?limit=5');
      setRecentInvoices(invoicesData.invoices || []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'manager': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'user': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
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
              <Link href="/admin" className="flex items-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg shadow-green-500/30">
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
              <Link href="/admin/invoices" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-green-600/10 hover:text-green-400 rounded-lg transition-colors border border-transparent hover:border-green-500/30">
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
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-green-400 capitalize">{user?.role}</p>
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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-green-400">Admin</span> Dashboard
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">System Overview & Management</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-green-600/10 border border-green-500/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">System Online</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Stats Grid - Beautiful Green Bordered Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Users Card */}
              <div className="group relative rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-black/40 to-green-900/20 hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-2">Total Users</p>
                  <p className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</p>
                  <p className="text-xs text-green-400 mt-2">{stats?.activeUsers || 0} active</p>
                </div>
              </div>

              {/* Total Invoices Card */}
              <div className="group relative rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-black/40 to-green-900/20 hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-2">Total Invoices</p>
                  <p className="text-4xl font-bold text-white">{stats?.totalInvoices || 0}</p>
                  <p className="text-xs text-blue-400 mt-2">{stats?.pendingInvoices || 0} pending</p>
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="group relative rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-black/40 to-green-900/20 hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-2">Total Revenue</p>
                  <p className="text-4xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
                  <p className="text-xs text-emerald-400 mt-2">{stats?.paidInvoices || 0} paid invoices</p>
                </div>
              </div>

              {/* Overdue Invoices Card */}
              <div className="group relative rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-red-500/60 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-black/40 to-red-900/20 hover:shadow-red-500/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-2">Overdue Invoices</p>
                  <p className="text-4xl font-bold text-white">{stats?.overdueInvoices || 0}</p>
                  <p className="text-xs text-red-400 mt-2">Requires attention</p>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
                <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Recent Users
                    </h3>
                    <Link href="/admin/users" className="text-sm text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
                      View All
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                  ) : recentUsers.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No users found</p>
                  ) : (
                    <div className="space-y-3">
                      {recentUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors border border-green-500/10">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {u.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{u.email}</p>
                              <p className="text-xs text-gray-400">Joined {formatDate(u.created_at)}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role)} flex-shrink-0 ml-2`}>
                            {u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Invoices */}
              <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
                <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Recent Invoices
                    </h3>
                    <Link href="/admin/invoices" className="text-sm text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
                      View All
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                  ) : recentInvoices.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No invoices found</p>
                  ) : (
                    <div className="space-y-3">
                      {recentInvoices.map((invoice) => (
                        <div key={invoice.id} className="p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors border border-green-500/10">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-white">{invoice.invoice_number}</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                                  {invoice.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 truncate">{invoice.client_name}</p>
                              <p className="text-xs text-gray-500 mt-1">{invoice.user_email || 'N/A'}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-green-400">{formatCurrency(invoice.amount)}</p>
                              <p className="text-xs text-gray-400">Due {formatDate(invoice.due_date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/users" className="group p-4 bg-gradient-to-br from-green-600/10 to-transparent rounded-xl border-2 border-green-500/30 hover:border-green-500/60 transition-all hover:-translate-y-1">
                  <svg className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <p className="text-sm font-semibold text-white">Manage Users</p>
                  <p className="text-xs text-gray-400 mt-1">Add, edit, or assign roles</p>
                </Link>
                <Link href="/admin/invoices" className="group p-4 bg-gradient-to-br from-blue-600/10 to-transparent rounded-xl border-2 border-blue-500/30 hover:border-blue-500/60 transition-all hover:-translate-y-1">
                  <svg className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-sm font-semibold text-white">View All Invoices</p>
                  <p className="text-xs text-gray-400 mt-1">System-wide invoice overview</p>
                </Link>
                <Link href="/admin/settings" className="group p-4 bg-gradient-to-br from-purple-600/10 to-transparent rounded-xl border-2 border-purple-500/30 hover:border-purple-500/60 transition-all hover:-translate-y-1">
                  <svg className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-white">System Settings</p>
                  <p className="text-xs text-gray-400 mt-1">Configure system preferences</p>
                </Link>
                <Link href="/dashboard" className="group p-4 bg-gradient-to-br from-gray-600/10 to-transparent rounded-xl border-2 border-gray-500/30 hover:border-gray-500/60 transition-all hover:-translate-y-1">
                  <svg className="w-8 h-8 text-gray-400 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p className="text-sm font-semibold text-white">User Dashboard</p>
                  <p className="text-xs text-gray-400 mt-1">Switch to user view</p>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}
