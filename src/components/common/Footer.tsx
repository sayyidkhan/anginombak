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
          <div className="flex gap-6">
            <Link to="/prompt" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Create Adventure
            </Link>
            <Link to="/explore" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              Explore
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
