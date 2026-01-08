'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clientApi } from '../lib/client-api';
import type { Client, ClientStatus } from '../lib/types';
import ProtectedRoute from '../components/protected-route';
import LoadingSpinner from '../components/loading-spinner';
import ErrorMessage from '../components/error-message';
import EmptyState from '../components/empty-state';

export default function ClientsPage() {
  return (
    <ProtectedRoute>
      <ClientsContent />
    </ProtectedRoute>
  );
}

function ClientsContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [archiving, setArchiving] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientApi.getClients();
      setClients(response.clients);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveClient = async (id: string) => {
    if (!confirm('Are you sure you want to archive this client?')) return;

    try {
      setArchiving(id);
      await clientApi.archiveClient(id);
      await loadClients();
    } catch (err: any) {
      setError(err.message || 'Failed to archive client');
    } finally {
      setArchiving(null);
    }
  };

  const getStatusBadgeClass = (status: ClientStatus) => {
    switch (status) {
      case 'active':
        return 'bg-primary/20 text-primary border-primary/40';
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
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
                <h1 className="text-xl sm:text-2xl font-bold text-white">Clients</h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage your clients</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/clients/create')}
              className="px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-accent text-gray-900 rounded-lg shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
            >
              + Add Client
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {clients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            message="Get started by adding your first client."
            actionLabel="Add Client"
            onAction={() => router.push('/clients/create')}
          />
        ) : (
          <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 rounded-xl overflow-hidden shadow-lg transition-all">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {client.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {client.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(
                            client.status
                          )}`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/clients/${client.id}`)}
                          className="text-primary hover:text-primary-accent mr-4 transition-colors"
                        >
                          View
                        </button>
                        {client.status !== 'archived' && (
                          <button
                            onClick={() => handleArchiveClient(client.id)}
                            disabled={archiving === client.id}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                          >
                            {archiving === client.id ? 'Archiving...' : 'Archive'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {clients.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 rounded-xl p-6 transition-all shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Clients
                    </dt>
                    <dd className="text-2xl font-bold text-white">
                      {clients.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 rounded-xl p-6 transition-all shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-green-500/10 rounded-xl">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Active Clients
                    </dt>
                    <dd className="text-2xl font-bold text-white">
                      {clients.filter((c) => c.status === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm border-2 border-primary/20 hover:border-primary/30 rounded-xl p-6 transition-all shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-gray-500/10 rounded-xl">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Archived Clients
                    </dt>
                    <dd className="text-2xl font-bold text-white">
                      {clients.filter((c) => c.status === 'archived').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
