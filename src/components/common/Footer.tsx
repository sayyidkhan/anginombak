import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm opacity-80">&copy; 2025 {APP_NAME}. All rights reserved.</p>
            <p className="text-xs opacity-60 mt-1">Version 1.0.0</p>
          </div>
          {/* Mobile: vertical, Desktop: horizontal */}
          <div className="flex flex-col md:flex-row md:gap-6 items-center md:items-start gap-3">
            <Link to="/prompt" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Create Adventure
            </Link>
            <Link to="/home" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Home
            </Link>
            <Link to="/marketplace" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Marketplace
            </Link>
            <Link to="/social" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Social
            </Link>
            <Link to="/login" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Account
            </Link>
            <a href="#" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
