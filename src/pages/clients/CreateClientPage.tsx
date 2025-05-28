import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/clients', formData);
      toast.success('Client created successfully');
      navigate(`/clients/${response.data._id}`);
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(error.response?.data?.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom page-container">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/clients')}
          className="text-secondary-600 hover:text-secondary-800 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-secondary-800">Create New Client</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card space-y-6">
          <div>
            <label htmlFor="name" className="form-label">Name *</label>
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
            <label htmlFor="email" className="form-label">Email *</label>
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
            <label htmlFor="company" className="form-label">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-input"
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateClientPage; 