import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary-500 text-white rounded flex items-center justify-center">
              <span className="font-bold text-xs">P</span>
            </div>
            <span className="font-medium text-secondary-800">PayMint</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-secondary-600">
              &copy; {year} PayMint. All rights reserved.
            </p>
            <p className="text-xs text-secondary-500 mt-1 flex items-center justify-center md:justify-end">
              Made with <Heart size={12} className="mx-1 text-red-500" /> for freelancers and small businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;