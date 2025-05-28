import React from 'react';
import LocalImage from '../assets/homepagelogo.jpg';
import { Link } from 'react-router-dom';
import { CheckCircle, CreditCard, BarChart3, Send, ShieldCheck } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
                Simplified Invoicing for Freelancers & Small Businesses
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Create professional invoices, manage clients, and track payments with ease.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn bg-accent-500 text-secondary-800 hover:bg-accent-600 focus:ring-accent-500 text-center py-3 px-6">
                  Get Started — It's Free
                </Link>
                <Link to="/login" className="btn bg-white/20 text-white hover:bg-white/30 focus:ring-white text-center py-3 px-6">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:w-5/12">
              <img 
                src={LocalImage} 
                alt="Invoice Dashboard" 
                className="rounded-lg shadow-lg w-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">Everything You Need to Manage Your Business</h2>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              PayMint provides all the tools you need to create invoices, manage clients, and get paid faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <CreditCard className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Professional Invoices</h3>
              <p className="text-secondary-600">
                Create beautiful, professional invoices in seconds and deliver them to your clients instantly.
              </p>
            </div>

            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Client Management</h3>
              <p className="text-secondary-600">
                Organize your clients with detailed profiles and communication history all in one place.
              </p>
            </div>

            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Financial Analytics</h3>
              <p className="text-secondary-600">
                Track your financial performance with clear visual reports and income forecasts.
              </p>
            </div>

            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <Send className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Email Integration</h3>
              <p className="text-secondary-600">
                Send professional invoices directly via email with custom templates and attachments.
              </p>
            </div>

            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <ShieldCheck className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Secure Payments</h3>
              <p className="text-secondary-600">
                Enable online payments and get paid faster with secure payment processing.
              </p>
            </div>

            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-primary-100 w-12 h-12 flex items-center justify-center mb-4">
                <CreditCard className="text-primary-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">Payment Tracking</h3>
              <p className="text-secondary-600">
                Track payment status and automatically remind clients about overdue invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-500 py-16 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to streamline your invoicing?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white   ">
            Join thousands of freelancers and small businesses who use PayMint to manage their finances.
          </p>
          <Link to="/register" className="btn bg-accent-500 text-secondary-800 hover:bg-accent-600 focus:ring-accent-500 py-3 px-8 text-lg">
            Get Started For Free  
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">What Our Users Say</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what freelancers and small business owners say about PayMint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-800">Sarah Johnson</h4>
                  <p className="text-sm text-secondary-500">Freelance Designer</p>
                </div>
              </div>
              <p className="text-secondary-700">
                "PayMint has completely transformed how I manage my freelance business. Creating invoices is now a breeze, and I get paid much faster!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-800">Michael Roberts</h4>
                  <p className="text-sm text-secondary-500">Small Business Owner</p>
                </div>
              </div>
              <p className="text-secondary-700">
                "The dashboard gives me a clear picture of my finances at a glance. I can now make better business decisions based on real data."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold">L</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-800">Lisa Thompson</h4>
                  <p className="text-sm text-secondary-500">Marketing Consultant</p>
                </div>
              </div>
              <p className="text-secondary-700">
                "Client management has never been easier. I can track all history in one place. Highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-secondary-800 mb-4">Start Creating Professional Invoices Today</h2>
          <p className="text-secondary-600 mb-6">No credit card required. Free to get started.</p>
          <Link to="/register" className="btn btn-primary py-3 px-8">
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;