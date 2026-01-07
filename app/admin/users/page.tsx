'use client';

/**
 * User Management Page
 * 
 * Admin page for managing all users, assigning roles, and viewing user statistics
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import AdminRoute from '@/app/components/admin-route';
import Link from 'next/link';
import apiClient from '@/app/lib/api-client';
import type { UserWithInvoices } from '@/app/lib/types';

export default function UsersManagementPage() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<UserWithInvoices[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithInvoices | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'manager' | 'admin'>('user');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.get<{ users: UserWithInvoices[] }>('/admin/users');
      setUsers(data.users || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      setIsUpdating(true);
      await apiClient.put(`/admin/users/${selectedUser.id}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Error updating role:', err);
      alert(err.message || 'Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  const openRoleModal = (user: UserWithInvoices) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'manager': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'user': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (u.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
    regularUsers: users.filter(u => u.role === 'user').length,
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
              <Link href="/admin/users" className="flex items-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg shadow-green-500/30">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    User Management
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Manage users and assign roles</p>
                </div>
                <button onClick={fetchUsers} className="inline-flex items-center px-4 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-500/30">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="rounded-2xl shadow-2xl p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-white">{userStats.total}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-2">Admins</p>
                    <p className="text-3xl font-bold text-white">{userStats.admins}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-2">Managers</p>
                    <p className="text-3xl font-bold text-white">{userStats.managers}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-2xl p-6 border-2 border-gray-500/30 hover:border-gray-500/50 transition-all backdrop-blur-sm bg-black/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-2">Regular Users</p>
                    <p className="text-3xl font-bold text-white">{userStats.regularUsers}</p>
                  </div>
                  <div className="p-3 bg-gray-500/10 rounded-xl border border-gray-500/30">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
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
                      placeholder="Search users by email or name..."
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
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                <h3 className="text-lg font-bold text-white">All Users ({filteredUsers.length})</h3>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-400">{error}</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-400">No users found</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-green-600/5 border-b border-green-500/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-500/10">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-green-600/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {u.email?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{u.email}</p>
                                {u.name && <p className="text-xs text-gray-400">{u.name}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openRoleModal(u)}
                              disabled={u.id === currentUser?.id}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Change Role
                            </button>
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

        {/* Role Change Modal */}
        {isRoleModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Change User Role</h3>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-green-600/10 border border-green-500/30 rounded-lg mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {selectedUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{selectedUser.email}</p>
                    <p className="text-xs text-gray-400">Current: <span className="text-green-400 capitalize">{selectedUser.role}</span></p>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select New Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'user' | 'manager' | 'admin')}
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                >
                  <option value="user">User - Basic access</option>
                  <option value="manager">Manager - Can create/send invoices</option>
                  <option value="admin">Admin - Full system access</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-3 text-sm font-medium bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleChange}
                  disabled={isUpdating || newRole === selectedUser.role}
                  className="flex-1 px-4 py-3 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update Role'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
