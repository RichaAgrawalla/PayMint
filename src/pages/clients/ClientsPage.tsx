import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Plus } from 'lucide-react';
import axios from 'axios';
import { Client } from '../../types';
import { toast } from 'react-toastify';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/clients');
        setClients(response.data);
      } catch (error: any) {
        console.error('Error fetching clients:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 401) {
            toast.error('Please log in to view clients');
          } else if (error.response.status === 403) {
            toast.error('You do not have permission to view clients');
          } else if (error.response.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('Failed to fetch clients. Please try again later.');
          }
        } else if (error.request) {
          // The request was made but no response was received
          toast.error('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error('Error setting up request. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <Link 
          to="/clients/new" 
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Client
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search clients by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/clients/${client._id}`} className="text-primary-600 hover:text-primary-800">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/clients/${client._id}`}
                        className="text-primary-600 hover:text-primary-800 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        to={`/clients/${client._id}/edit`}
                        className="text-secondary-600 hover:text-secondary-800"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No clients match your search criteria.' : 'You haven\'t added any clients yet.'}
          </p>
          {!searchTerm && (
            <Link 
              to="/clients/new" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Add your first client
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;