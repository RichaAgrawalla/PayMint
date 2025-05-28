import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;