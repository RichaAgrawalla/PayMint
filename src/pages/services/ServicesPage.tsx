import React, { useState, useEffect } from 'react';
import { Plus, Search, Package2, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Service } from '../../types';
import { toast } from 'react-toastify';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rate: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`/services/${editingService._id}`, {
          ...formData,
          rate: parseFloat(formData.rate)
        });
        toast.success('Service updated successfully');
      } else {
        await axios.post('/services', {
          ...formData,
          rate: parseFloat(formData.rate)
        });
        toast.success('Service created successfully');
      }
      setShowAddModal(false);
      setEditingService(null);
      setFormData({ title: '', description: '', rate: '' });
      fetchServices();
    } catch (error) {
      console.error('Failed to save service:', error);
      toast.error(editingService ? 'Failed to update service' : 'Failed to create service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      rate: service.rate.toString()
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await axios.delete(`/services/${id}`);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Failed to delete service');
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="container-custom page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({ title: '', description: '', rate: '' });
            setShowAddModal(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Service
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-secondary-400" />
        </div>
        <input
          type="text"
          className="form-input pl-10"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">{service.title}</h3>
                  <p className="text-secondary-600 mb-4">{service.description}</p>
                  <p className="text-xl font-bold text-primary-600">{formatCurrency(service.rate)}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-secondary-600 hover:text-secondary-800 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package2 size={48} className="mx-auto text-secondary-400 mb-4" />
          <h3 className="text-lg font-medium text-secondary-800 mb-2">No services found</h3>
          <p className="text-secondary-600 mb-4">
            {searchTerm ? 'No services match your search criteria.' : 'Get started by adding your first service.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              Add Your First Service
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-secondary-800 mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="form-label">Service Title</label>
                  <input
                    type="text"
                    id="title"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    className="form-input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rate" className="form-label">Hourly Rate ($)</label>
                  <input
                    type="number"
                    id="rate"
                    className="form-input"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingService(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;