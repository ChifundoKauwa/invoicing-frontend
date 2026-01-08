// Shared domain and DTO types that mirror the backend invoicing API contracts.

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'manager' | 'admin';
  createdAt: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'user' | 'manager' | 'admin';
}

export interface RegisterResponse {
  accessToken: string;
  token_type: string;
  user: User;
}

// Client types
export enum ClientStatus {
  Active = 'active',
  Inactive = 'inactive',
  Archived = 'archived'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: ClientStatus;
}

export interface ClientListResponse {
  clients: Client[];
  total: number;
  page?: number;
  per_page?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  client_email?: string;
  amount: number;
  currency?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface CreateInvoiceRequest {
  clientId: string;
  amount: number;
  currency?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  per_page: number;
}

// Admin-specific types
export interface UserWithInvoices extends User {
  invoiceCount?: number;
  totalRevenue?: number;
  lastActive?: string;
}

export interface UsersListResponse {
  users: UserWithInvoices[];
  total: number;
  page?: number;
  per_page?: number;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: 'user' | 'manager' | 'admin';
}

export interface UpdateUserRoleResponse {
  user: User;
  message: string;
}

export interface SystemStats {
  totalUsers: number;
  totalInvoices: number;
  totalRevenue: number;
  activeUsers: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
}

export interface AdminInvoiceWithUser extends Invoice {
  user_id?: string;
  user_email?: string;
  user_name?: string;
}
