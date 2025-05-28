import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import EditClientPage from './pages/clients/EditClientPage';
import ServicesPage from './pages/services/ServicesPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import InvoiceDetailPage from './pages/invoices/InvoiceDetailPage';
import CreateInvoicePage from './pages/invoices/CreateInvoicePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import CreateClientPage from './pages/clients/CreateClientPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clients" 
                element={
                  <ProtectedRoute>
                    <ClientsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clients/:id" 
                element={
                  <ProtectedRoute>
                    <ClientDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clients/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditClientPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clients/new" 
                element={
                  <ProtectedRoute>
                    <CreateClientPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <ProtectedRoute>
                    <ServicesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/invoices" 
                element={
                  <ProtectedRoute>
                    <InvoicesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/invoices/create" 
                element={
                  <ProtectedRoute>
                    <CreateInvoicePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/invoices/:id" 
                element={
                  <ProtectedRoute>
                    <InvoiceDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </Router>
    </AuthProvider>
  );
};

export default App;