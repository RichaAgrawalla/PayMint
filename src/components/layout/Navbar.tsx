import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, CreditCard, BarChart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 text-white rounded flex items-center justify-center">
              <span className="font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-secondary-800">PayMint</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-secondary-700 hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
                <Link to="/clients" className="text-secondary-700 hover:text-primary-500 transition-colors">
                  Clients
                </Link>
                <Link to="/services" className="text-secondary-700 hover:text-primary-500 transition-colors">
                  Services
                </Link>
                <Link to="/invoices" className="text-secondary-700 hover:text-primary-500 transition-colors">
                  Invoices
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1">
                    <span className="text-secondary-700">{user?.name}</span>
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-dropdown z-10 hidden group-hover:block animate-fade-in">
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-gray-100">
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-secondary-700 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-secondary-500">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 p-4 border-b">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-secondary-800">{user?.name}</div>
                    <div className="text-sm text-secondary-500">{user?.email}</div>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-4 py-3 text-secondary-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart size={20} className="mr-3" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/clients" 
                    className="flex items-center px-4 py-3 text-secondary-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} className="mr-3" />
                    Clients
                  </Link>
                  <Link 
                    to="/services" 
                    className="flex items-center px-4 py-3 text-secondary-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={20} className="mr-3" />
                    Services
                  </Link>
                  <Link 
                    to="/invoices" 
                    className="flex items-center px-4 py-3 text-secondary-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <CreditCard size={20} className="mr-3" />
                    Invoices
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-3 text-secondary-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} className="mr-3" />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-gray-50"
                  >
                    <LogOut size={20} className="mr-3" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-secondary-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="mx-4 btn btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;