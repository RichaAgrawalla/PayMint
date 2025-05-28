import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-card p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-500 text-white rounded-lg mx-auto flex items-center justify-center">
            <span className="font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-secondary-800">Welcome Back</h1>
          <p className="text-secondary-600 mt-1">Sign in to your account</p>
        </div>

        {(formError || error) && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="name@company.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="••••••••"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-secondary-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-secondary-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;