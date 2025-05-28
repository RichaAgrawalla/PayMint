import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UpdateProfileData) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  company?: string;
  address?: string;
  phone?: string;
  logo?: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Configure axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  
  // Set auth token for all requests if it exists
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get('/users/me');
          setState(prev => ({
            ...prev,
            user: res.data,
            isAuthenticated: true,
            isLoading: false,
          }));
        } catch (err) {
          localStorage.removeItem('token');
          setState(prev => ({
            ...prev,
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please log in again.'
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    loadUser();
  }, [state.token]);

  const register = async (userData: RegisterData) => {
    try {
      const res = await axios.post('/users/register', userData);
      localStorage.setItem('token', res.data.token);
      // Set axios Authorization header immediately
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setState(prev => ({
        ...prev,
        token: res.data.token,
        user: res.data.user,
        isAuthenticated: true,
        error: null,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Registration failed',
      }));
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      // Set axios Authorization header immediately
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setState(prev => ({
        ...prev,
        token: res.data.token,
        user: res.data.user,
        isAuthenticated: true,
        error: null,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Invalid credentials',
      }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const updateProfile = async (userData: UpdateProfileData) => {
    try {
      const res = await axios.put('/users/me', userData);
      setState(prev => ({
        ...prev,
        user: res.data,
        error: null,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Failed to update profile',
      }));
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
