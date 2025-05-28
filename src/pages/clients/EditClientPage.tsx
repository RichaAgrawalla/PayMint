import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Client } from '../../types';
import { toast } from 'react-toastify';

const EditClientPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`/clients/${id}`);
        setClient(response.data);
        setFormData({
          name: response.data.name,
          company: response.data.company,
          email: response.data.email,
          phone: response.data.phone || '',
          address: response.data.address || ''
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load client');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/clients/${id}`, formData);
      toast.success('Client updated successfully');
      navigate(`/clients/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update client');
    }
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
          <button
            onClick={() => navigate('/clients')}
            className="btn btn-primary"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/clients/${id}`)}
            className="text-secondary-600 hover:text-secondary-800 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-secondary-800">Edit Client</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="company" className="form-label">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/clients/${id}`)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientPage; 