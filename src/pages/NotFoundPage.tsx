import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl font-bold text-primary-500">404</div>
          <h1 className="mt-4 text-3xl font-bold text-secondary-800">Page Not Found</h1>
          <p className="mt-2 text-lg text-secondary-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link to="/" className="inline-flex items-center justify-center btn btn-primary">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;