import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { Invoice, Client } from '../../types';
import { toast } from 'react-toastify';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, dateFilter]);

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter !== 'all') {
        const now = new Date();
        switch (dateFilter) {
          case 'thisMonth':
            params.append('startDate', new Date(now.getFullYear(), now.getMonth(), 1).toISOString());
            break;
          case 'lastMonth':
            params.append('startDate', new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString());
            params.append('endDate', new Date(now.getFullYear(), now.getMonth(), 0).toISOString());
            break;
          case 'thisYear':
            params.append('startDate', new Date(now.getFullYear(), 0, 1).toISOString());
            break;
        }
      }
      
      const response = await axios.get(`/invoices?${params.toString()}`);
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isClientObject = (client: Client | string): client is Client => {
    return typeof client !== 'string' && 'name' in client;
  };

  const getClientName = (client: Client | string) => {
    if (!isClientObject(client)) return 'Unknown Client';
    return client.name;
  };

  const getClientCompany = (client: Client | string) => {
    if (!isClientObject(client)) return '';
    return client.company;
  };

  const getClientId = (client: Client | string) => {
    if (typeof client === 'string') return client;
    return client._id;
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(invoice.client).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-custom page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Invoices</h1>
        <Link 
          to="/invoices/create"
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white p-6">
          <div className="text-sm font-medium text-secondary-600">Total Invoices</div>
          <div className="mt-2 text-3xl font-bold text-secondary-800">{invoices.length}</div>
        </div>
        <div className="card bg-white p-6">
          <div className="text-sm font-medium text-secondary-600">Paid</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {invoices.filter(i => i.status === 'paid').length}
          </div>
        </div>
        <div className="card bg-white p-6">
          <div className="text-sm font-medium text-secondary-600">Unpaid</div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">
            {invoices.filter(i => i.status === 'unpaid').length}
          </div>
        </div>
        <div className="card bg-white p-6">
          <div className="text-sm font-medium text-secondary-600">Overdue</div>
          <div className="mt-2 text-3xl font-bold text-red-600">
            {invoices.filter(i => i.status === 'overdue').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-secondary-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10 w-full"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  className="form-input pr-10"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  className="form-input pr-10"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisYear">This Year</option>
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/invoices/${invoice._id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/clients/${getClientId(invoice.client)}`} 
                        className="text-primary-600 hover:text-primary-800">
                        {getClientName(invoice.client)}
                      </Link>
                      <div className="text-sm text-gray-500">{getClientCompany(invoice.client)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-800">
                        {formatCurrency(invoice.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {formatDate(invoice.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-secondary-400 mb-4" />
            <h3 className="text-lg font-medium text-secondary-800 mb-2">No invoices found</h3>
            <p className="text-secondary-600 mb-4">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'No invoices match your search criteria.'
                : 'Get started by creating your first invoice.'}
            </p>
            {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
              <Link 
                to="/invoices/create"
                className="btn btn-primary"
              >
                Create Your First Invoice
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;