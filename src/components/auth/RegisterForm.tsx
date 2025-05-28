import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const { register: registerUser, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="text-2xl font-bold mt-4 text-secondary-800">Create an Account</h1>
          <p className="text-secondary-600 mt-1">Start managing your invoices today</p>
        </div>

        {(formError || error) && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="John Doe"
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={`form-input ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-secondary-700">
                I agree to the <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-secondary-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;