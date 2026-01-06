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

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  amount: number;
  currency?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  per_page: number;
}
