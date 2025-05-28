import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Client, Service } from '../../types';
import { toast } from 'react-toastify';

interface InvoiceItem {
  service: string;
  title: string;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
}

const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get('client');

  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedClient, setSelectedClient] = useState<string>(preselectedClientId || '');
  const [dueDate, setDueDate] = useState<string>('');
  const [items, setItems] = useState<InvoiceItem[]>([{
    service: '',
    title: '',
    description: '',
    rate: 0,
    quantity: 1,
    amount: 0
  }]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          axios.get('/clients'),
          axios.get('/services')
        ]);
        setClients(clientsRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load clients and services');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleServiceSelect = (index: number, serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    if (!service) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      service: serviceId,
      title: service.title,
      description: service.description,
      rate: service.rate,
      amount: service.rate * newItems[index].quantity
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      amount: newItems[index].rate * quantity
    };
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, {
      service: '',
      title: '',
      description: '',
      rate: 0,
      quantity: 1,
      amount: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();

    setSubmitting(true);
    try {
      const response = await axios.post('/invoices', {
        client: selectedClient,
        items,
        subtotal,
        taxRate,
        taxAmount,
        total,
        dueDate,
        notes
      });

      toast.success('Invoice created successfully');
      navigate(`/invoices/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container-custom page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="container-custom page-container">
      <div className="flex items-center mb-8">
        <Link to="/invoices" className="text-secondary-600 hover:text-secondary-800 mr-4">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-secondary-800">Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Selection */}
          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-800 mb-4">Client Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="client" className="form-label">Select Client *</label>
                <select
                  id="client"
                  className="form-input"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name} - {client.company}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="form-label">Due Date *</label>
                <input
                  type="date"
                  id="dueDate"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Invoice Settings */}
          <div className="card">
            <h2 className="text-lg font-semibold text-secondary-800 mb-4">Invoice Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="taxRate" className="form-label">Tax Rate (%)</label>
                <input
                  type="number"
                  id="taxRate"
                  className="form-input"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  id="notes"
                  className="form-input"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes or payment instructions"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-secondary-800">Invoice Items</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="btn btn-outline flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Item
            </button>
          </div>

          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-secondary-800">Item {index + 1}</h3>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Service</label>
                    <select
                      className="form-input"
                      value={item.service}
                      onChange={(e) => handleServiceSelect(index, e.target.value)}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.title} - {formatCurrency(service.rate)}/hr
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index] = { ...newItems[index], title: e.target.value };
                        setItems(newItems);
                      }}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index] = { ...newItems[index], description: e.target.value };
                        setItems(newItems);
                      }}
                    />
                  </div>

                  <div>
                    <label className="form-label">Rate</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.rate}
                      onChange={(e) => {
                        const rate = Number(e.target.value);
                        const newItems = [...items];
                        newItems[index] = {
                          ...newItems[index],
                          rate,
                          amount: rate * newItems[index].quantity
                        };
                        setItems(newItems);
                      }}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                      min="1"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Amount</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formatCurrency(item.amount)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="card">
          <div className="flex justify-end">
            <div className="w-full md:w-64">
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Subtotal</span>
                <span className="font-medium text-secondary-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Tax ({taxRate}%)</span>
                <span className="font-medium text-secondary-800">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-lg font-medium text-secondary-800">Total</span>
                <span className="text-lg font-bold text-secondary-800">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link to="/invoices" className="btn btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePage;