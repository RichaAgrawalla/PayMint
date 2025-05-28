import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { User, Building, Mail, Phone, MapPin } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    address: user?.address || '',
    phone: user?.phone || '',
    logo: user?.logo || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-secondary-800 mb-8">Profile Settings</h1>

        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                
                  <User size={32} className="text-primary-500" />
                )}
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-white">{formData.name}</h2>
                <p className="text-primary-100">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="form-label flex items-center">
                  <User size={16} className="mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="company" className="form-label flex items-center">
                  <Building size={16} className="mr-2" />
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  className="form-input"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="form-label flex items-center">
                  <Phone size={16} className="mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input bg-gray-50"
                  value={user?.email}
                  disabled
                />
                <p className="mt-1 text-sm text-secondary-500">
                  Email cannot be changed
                </p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="form-label flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Business Address
                </label>
                <textarea
                  id="address"
                  className="form-input"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="logo" className="form-label flex items-center">
                  <User size={16} className="mr-2" />
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logo"
                  className="form-input"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
                <p className="mt-1 text-sm text-secondary-500">
                  Enter a URL for your company logo
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Section */}
        <div className="mt-8 bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Security</h2>
          <p className="text-secondary-600 mb-4">
            For security reasons, please contact support if you need to change your password or email address.
          </p>
          <button
            type="button"
            className="btn btn-outline text-red-600 hover:bg-red-50"
            onClick={() => toast.info('Contact support to change your password')}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;