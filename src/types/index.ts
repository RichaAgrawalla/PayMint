// Auth Types
export interface User {
  _id: string;
  name: string;
  email: string;
  company?: string;
  logo?: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Client Types
export interface Client {
  _id: string;
  name: string;
  email: string;
  company?: string;
  address?: string;
  phone?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  _id: string;
  title: string;
  description: string;
  rate: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

// Invoice Types
export interface InvoiceItem {
  service: string;
  title: string;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  client: string | Client;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  notes?: string;
  paymentDate?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  monthlyIncomeData: {
    month: string;
    amount: number;
  }[];
}