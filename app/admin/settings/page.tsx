'use client';

/**
 * System Settings Page (Admin)
 * 
 * Configure system-wide settings and preferences
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import AdminRoute from '@/app/components/admin-route';
import Link from 'next/link';

export default function SystemSettingsPage() {
  const { user: currentUser, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    siteName: 'InvoiceApp',
    siteEmail: 'admin@invoiceapp.com',
    invoicePrefix: 'INV-',
    defaultCurrency: 'USD',
    defaultDueDays: 30,
    enableRegistration: true,
    requireEmailVerification: false,
    defaultUserRole: 'user' as 'user' | 'manager' | 'admin',
    maxInvoicesPerUser: 100,
    enableNotifications: true,
    enableBackups: true,
    backupFrequency: 'daily' as 'hourly' | 'daily' | 'weekly',
  });

  const handleLogout = () => {
    logout();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Make API call to save settings
      // await apiClient.put('/admin/settings', settings);

      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setIsSaving(false);
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
              <Link href="/admin/invoices" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-green-600/10 hover:text-green-400 rounded-lg transition-colors border border-transparent hover:border-green-500/30">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                All Invoices
              </Link>
              <Link href="/admin/settings" className="flex items-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg shadow-green-500/30">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    System Settings
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Configure system-wide preferences</p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Success/Error Message */}
            {saveMessage && (
              <div className={`rounded-2xl shadow-2xl p-4 border-2 ${saveMessage.type === 'success' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center gap-3">
                  {saveMessage.type === 'success' ? (
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <p className={`text-sm font-medium ${saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {saveMessage.text}
                  </p>
                </div>
              </div>
            )}

            {/* General Settings */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  General Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Email</label>
                    <input
                      type="email"
                      value={settings.siteEmail}
                      onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Invoice Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      value={settings.invoicePrefix}
                      onChange={(e) => setSettings({...settings, invoicePrefix: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default Due Days</label>
                    <input
                      type="number"
                      value={settings.defaultDueDays}
                      onChange={(e) => setSettings({...settings, defaultDueDays: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* User Settings */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  User Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default User Role</label>
                    <select
                      value={settings.defaultUserRole}
                      onChange={(e) => setSettings({...settings, defaultUserRole: e.target.value as 'user' | 'manager' | 'admin'})}
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                    >
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Invoices Per User</label>
                    <input
                      type="number"
                      value={settings.maxInvoicesPerUser}
                      onChange={(e) => setSettings({...settings, maxInvoicesPerUser: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-green-500/20">
                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Enable Registration</p>
                      <p className="text-xs text-gray-400">Allow new users to register</p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, enableRegistration: !settings.enableRegistration})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableRegistration ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableRegistration ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Email Verification</p>
                      <p className="text-xs text-gray-400">Require email verification for new users</p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, requireEmailVerification: !settings.requireEmailVerification})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.requireEmailVerification ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-500/30 backdrop-blur-sm bg-black/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-600/10 to-transparent">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  System Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Enable Notifications</p>
                      <p className="text-xs text-gray-400">Send email notifications to users</p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, enableNotifications: !settings.enableNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableNotifications ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Enable Backups</p>
                      <p className="text-xs text-gray-400">Automatically backup system data</p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, enableBackups: !settings.enableBackups})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableBackups ? 'bg-green-600' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableBackups ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {settings.enableBackups && (
                    <div className="ml-4 p-4 bg-gray-900/30 rounded-lg border-l-4 border-green-500/50">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => setSettings({...settings, backupFrequency: e.target.value as 'hourly' | 'daily' | 'weekly'})}
                        className="w-full px-4 py-3 bg-gray-900/50 border-2 border-green-500/30 rounded-lg text-white focus:border-green-500/60 focus:outline-none transition-colors"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}
