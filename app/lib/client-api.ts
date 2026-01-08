// Client API service - handles all client-related API calls
import apiClient from './api-client';
import type { Client, ClientListResponse, CreateClientRequest, UpdateClientRequest } from './types';

export const clientApi = {
  // Create a new client
  async createClient(data: CreateClientRequest): Promise<Client> {
    return apiClient.post<Client>('/clients', data);
  },

  // Get all clients
  async getClients(): Promise<ClientListResponse> {
    const clients = await apiClient.get<Client[]>('/clients');
    return {
      clients: Array.isArray(clients) ? clients : [],
      total: Array.isArray(clients) ? clients.length : 0
    };
  },

  // Get a single client by ID
  async getClient(id: string): Promise<Client> {
    return apiClient.get<Client>(`/clients/${id}`);
  },

  // Update a client
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    return apiClient.put<Client>(`/clients/${id}`, data);
  },

  // Archive a client (soft delete)
  async archiveClient(id: string): Promise<void> {
    return apiClient.delete<void>(`/clients/${id}`);
  }
};
