import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, FileText, Edit, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Client, Invoice } from '../../types';

const ClientDetailPage: React.FC = () => {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const [clientRes, invoicesRes] = await Promise.all([
          axios.get(`/clients/${id}`),
          axios.get(`/invoices?client=${id}`)
        ]);
        setClient(clientRes.data);
        setInvoices(invoicesRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container-custom page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="container-custom page-container">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Client</h2>
          <p className="text-red-600 mb-4">{error || 'Client not found'}</p>
          <Link to="/clients" className="btn btn-primary">
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/clients" className="text-secondary-600 hover:text-secondary-800 mr-4">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-800">{client.name}</h1>
            <p className="text-secondary-600">{client.company}</p>
          </div>
        </div>
        <Link 
          to={`/clients/${id}/edit`}
          className="btn btn-primary flex items-center"
        >
          <Edit size={16} className="mr-2" />
          Edit Client
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client Info Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-800 mb-4">Client Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Building className="w-5 h-5 text-secondary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-secondary-800">{client.company}</p>
                  <p className="text-sm text-secondary-600">Company</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-secondary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-secondary-800">{client.email}</p>
                  <p className="text-sm text-secondary-600">Email</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-secondary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-secondary-800">{client.phone || 'Not provided'}</p>
                  <p className="text-sm text-secondary-600">Phone</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-secondary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-secondary-800">{client.address || 'Not provided'}</p>
                  <p className="text-sm text-secondary-600">Address</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-secondary-800">Invoices</h2>
              <Link 
                to={`/invoices/create?client=${id}`}
                className="btn btn-primary flex items-center"
              >
                <FileText size={16} className="mr-2" />
                Create Invoice
              </Link>
            </div>

            {invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Link 
                            to={`/invoices/${invoice._id}`}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                          >
                            {invoice.invoiceNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-secondary-600">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-secondary-800">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              invoice.status === 'unpaid' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-secondary-600">
                          {formatDate(invoice.dueDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={40} className="mx-auto text-secondary-400 mb-4" />
                <h3 className="text-lg font-medium text-secondary-800 mb-2">No Invoices Yet</h3>
                <p className="text-secondary-600 mb-4">
                  Create your first invoice for this client to start tracking payments.
                </p>
                <Link 
                  to={`/invoices/create?client=${id}`}
                  className="btn btn-primary"
                >
                  Create First Invoice
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;