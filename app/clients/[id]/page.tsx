'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { clientApi } from '../../lib/client-api';
import type { Client, ClientStatus, UpdateClientRequest } from '../../lib/types';
import ProtectedRoute from '../../components/protected-route';
import ErrorMessage from '../../components/error-message';
import LoadingSpinner from '../../components/loading-spinner';

export default function ClientDetailPage() {
  return (
    <ProtectedRoute>
      <ClientDetailContent />
    </ProtectedRoute>
  );
}

function ClientDetailContent() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateClientRequest>({});

  useEffect(() => {
    if (clientId) {
      loadClient();
    }
  }, [clientId]);

  const loadClient = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clientApi.getClient(clientId);
      setClient(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await clientApi.updateClient(clientId, formData);
      await loadClient();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update client');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this client?')) return;

    try {
      setSaving(true);
      await clientApi.archiveClient(clientId);
      router.push('/clients');
    } catch (err: any) {
      setError(err.message || 'Failed to archive client');
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!client) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Client not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Client Details</h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  View and manage client information
                </p>
              </div>
            </div>
            {!isEditing && client.status !== 'archived' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-semibold bg-primary hover:bg-primary-accent text-gray-900 rounded-lg transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95"
                >
                  Edit
                </button>
                <button
                  onClick={handleArchive}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-semibold text-red-400 border-2 border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

        <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 rounded-xl p-6 shadow-lg transition-all">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-400"
              >
                Client Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-2.5"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400"
              >
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-2.5"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-400"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-2.5"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-400"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-2.5"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-400"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-2.5 appearance-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: client.name,
                    email: client.email,
                    phone: client.phone,
                    address: client.address,
                    status: client.status,
                  });
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white border-2 border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold bg-primary hover:bg-primary-accent text-gray-900 rounded-lg transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400">Name</label>
              <p className="mt-1 text-base text-white">{client.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Email</label>
              <p className="mt-1 text-base text-white">{client.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Phone</label>
              <p className="mt-1 text-base text-white">
                {client.phone || '-'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Address</label>
              <p className="mt-1 text-base text-white">
                {client.address || '-'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Status</label>
              <span
                className={`mt-1 inline-block px-3 py-1 text-sm font-semibold rounded-full border ${
                  client.status === 'active'
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : client.status === 'inactive'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/40'
                }`}
              >
                {client.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Created
                </label>
                <p className="mt-1 text-sm text-gray-300">
                  {new Date(client.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-gray-300">
                  {new Date(client.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
