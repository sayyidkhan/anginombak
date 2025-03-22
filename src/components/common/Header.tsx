import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';
import windsurfIcon from '../../assets/windsurf.svg';

interface HeaderProps {
  pageTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('anginombak_username');
    setUsername(storedUsername);
  }, []);
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <img src={windsurfIcon} alt="Windsurf" className="w-10 h-10 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                <p className="text-sm opacity-90">Embark on Your Next Great Adventure!</p>
              </div>
            </Link>
          </div>
          
          {pageTitle && (
            <div className="hidden md:block text-xl font-semibold">
              {pageTitle}
            </div>
          )}
          
          <div className="flex items-center">
            {username ? (
              <div className="flex items-center">
                <span className="text-white mr-4">Welcome, {username}</span>
                <Link to="/login" className="text-white opacity-80 hover:opacity-100 transition-opacity">
                  <i className="pi pi-sign-out mr-1"></i>
                  Sign Out
                </Link>
              </div>
            ) : (
              <Link to="/login" className="text-white opacity-80 hover:opacity-100 transition-opacity">
                <i className="pi pi-sign-in mr-1"></i>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
