import React from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import windsurfIcon from '../assets/windsurf.svg';

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">The App</h1>
        <img src={windsurfIcon} alt="Windsurf" className="w-8 h-8" />
      </div>
      
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Adventure Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-l-4 border-green-500">
            <Link to="/promptresponse">
              <h2 className="text-xl font-medium text-green-700 cursor-pointer hover:text-green-800">Family Quest</h2>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Parenting Section */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-pink-500 h-full">
                <Link to="/parenting">
                  <h2 className="text-lg font-medium text-pink-700 mb-3 cursor-pointer hover:text-pink-800">Parenting</h2>
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="border-t border-gray-200 my-2"></div>
              </div>
            </div>
            
            {/* Services Section */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-pink-500 h-full">
                <Link to="/services">
                  <h2 className="text-lg font-medium text-pink-700 mb-3 cursor-pointer hover:text-pink-800">Services</h2>
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="border-t border-gray-200 my-2"></div>
              </div>
            </div>
            
            {/* Chat Bot Section */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 h-full">
                <h2 className="text-lg font-medium text-blue-700">Chat Bot</h2>
                <div className="mt-4">
                  <textarea 
                    className="w-full border rounded-md p-3 h-32 resize-none"
                    placeholder="Ask me anything..."
                    readOnly
                  />
                  <Button
                    label="Send"
                    className="mt-2 p-2 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ad Section */}
        <div className="w-48 bg-white p-4 shadow-inner">
          <div className="mb-4 border-2 border-red-500 rounded p-2 text-center text-red-500 font-bold">
            AD
          </div>
          <div className="mb-4 border-2 border-red-500 rounded p-2 text-center text-red-500 font-bold">
            AD
          </div>
          <div className="mb-4 border-2 border-red-500 rounded p-2 text-center text-red-500 font-bold">
            AD
          </div>
          <div className="mb-4 border-2 border-red-500 rounded p-2 text-center text-red-500 font-bold">
            AD
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
