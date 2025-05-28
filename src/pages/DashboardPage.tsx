import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart as BarChartIcon, 
  DollarSign, 
  Users, 
  FileText, 
  AlertCircle,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Invoice} from '../types';
import { DashboardStats} from '../types/dashboard';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch dashboard stats
        const statsRes = await axios.get('/invoices/dashboard/stats');
        console.log('Received dashboard stats:', statsRes.data);
        setStats(statsRes.data);
        
        // Fetch recent invoices
        const invoicesRes = await axios.get('/invoices?limit=3&sort=-createdAt');
        setRecentInvoices(invoicesRes.data);
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Chart data
  const chartData = {
    labels: stats?.monthlyIncomeData.map(data => data.month) || [],
    datasets: [
      {
        label: 'Monthly Income',
        data: stats?.monthlyIncomeData.map(data => data.amount) || [],
        backgroundColor: '#0CA6AC',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container-custom page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom page-container">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom page-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's an overview of your business.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/invoices/create" className="btn btn-primary">
            Create New Invoice
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white shadow-card p-6 flex items-start">
          <div className="rounded-full bg-primary-100 p-3 mr-4">
            <DollarSign size={20} className="text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Earnings</p>
            <h3 className="text-2xl font-bold text-secondary-800">
              {stats ? formatCurrency(stats.totalEarnings) : '$0.00'}
            </h3>
            <p className="text-sm text-green-600">
              +{stats ? formatCurrency(stats.currentMonthEarnings) : '$0.00'} this month
            </p>
          </div>
        </div>

        <div className="card bg-white shadow-card p-6 flex items-start">
          <div className="rounded-full bg-secondary-100 p-3 mr-4">
            <FileText size={20} className="text-secondary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Invoices</p>
            <h3 className="text-2xl font-bold text-secondary-800">
              {stats?.totalInvoices || 0}
            </h3>
            <div className="flex space-x-2 text-sm mt-1">
              <span className="text-green-600">{stats?.paidInvoices || 0} Paid</span>
              <span className="text-yellow-600">{stats?.unpaidInvoices || 0} Unpaid</span>
              <span className="text-red-600">{stats?.overdueInvoices || 0} Overdue</span>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-card p-6 flex items-start">
          <div className="rounded-full bg-accent-100 p-3 mr-4">
            <Users size={20} className="text-accent-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600">Clients</p>
            <h3 className="text-2xl font-bold text-secondary-800">
              {stats?.totalClients || 0}
            </h3>
            <Link to="/clients" className="text-sm text-primary-600 hover:text-primary-700">
              View all clients
            </Link>
          </div>
        </div>

        <div className="card bg-white shadow-card p-6 flex items-start">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <Clock size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600">Overdue Amount</p>
            <h3 className="text-2xl font-bold text-secondary-800">
              {stats ? formatCurrency(stats.overdueAmount) : '$0.00'}
            </h3>
            <p className="text-sm text-red-600">
              {stats?.overdueInvoices || 0} overdue invoices
            </p>
          </div>
        </div>
      </div>

      {/* Charts and Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Income Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-secondary-800">Monthly Income</h2>
            <select className="form-input w-auto text-sm">
              <option value="6months">Last 6 Months</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div className="h-[300px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-secondary-800">Recent Invoices</h2>
            <Link to="/invoices" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <Link 
                  key={invoice._id}
                  to={`/invoices/${invoice._id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 border border-gray-200">
                      <span className="text-sm font-medium text-secondary-700">{(invoice.client as any).name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800">{(invoice.client as any).name}</p>
                      <div className="flex items-center text-sm">
                        <span className="text-secondary-500">{invoice.invoiceNumber}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${invoice.status === 'paid' ? 'status-paid' : 
                            invoice.status === 'unpaid' ? 'status-unpaid' : 'status-overdue'}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-2">
                      <p className="font-medium text-secondary-800">{formatCurrency(invoice.total)}</p>
                      <p className="text-xs text-secondary-500">Due: {formatDate(invoice.dueDate)}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-secondary-600">No recent invoices</p>
                <Link to="/invoices/create" className="btn btn-primary mt-3">
                  Create Invoice
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;