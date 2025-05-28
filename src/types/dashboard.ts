export interface MonthlyIncomeData {
  month: string;
  amount: number;
}
export interface DashboardStats {
  totalEarnings: number;
  currentMonthEarnings: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalClients: number;
  overdueAmount: number;
  monthlyIncomeData: MonthlyIncomeData[];
} 