import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const Services: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Services</h1>
        <button className="text-2xl">≡</button>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Family Counseling</h3>
            <p className="text-gray-600 text-center">Professional guidance for family issues</p>
            <Button
              label="Book Now"
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700 p-button-sm"
            />
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Educational Tutoring</h3>
            <p className="text-gray-600 text-center">Personalized learning support</p>
            <Button
              label="Schedule Session"
              className="mt-4 bg-purple-600 text-white hover:bg-purple-700 p-button-sm"
            />
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Childcare Services</h3>
            <p className="text-gray-600 text-center">Reliable care for your children</p>
            <Button
              label="Learn More"
              className="mt-4 bg-green-600 text-white hover:bg-green-700 p-button-sm"
            />
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Family Events</h3>
            <p className="text-gray-600 text-center">Organized activities and outings</p>
            <Button
              label="View Events"
              className="mt-4 bg-yellow-600 text-white hover:bg-yellow-700 p-button-sm"
            />
          </div>
        </Card>
      </div>

      {/* Featured Services */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="bg-gray-100 h-48 mb-4"></div>
              <h3 className="font-medium mb-2">Family Therapy Program</h3>
              <p className="text-sm text-gray-600 mb-2">Comprehensive counseling services for families</p>
              <div className="flex justify-end">
                <span className="text-blue-600 text-sm">Learn more →</span>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="bg-gray-100 h-48 mb-4"></div>
              <h3 className="font-medium mb-2">Summer Camps</h3>
              <p className="text-sm text-gray-600 mb-2">Educational and fun activities for kids</p>
              <div className="flex justify-end">
                <span className="text-blue-600 text-sm">Learn more →</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-auto">
        <Button
          label="Contact Us"
          className="p-button-outlined p-button-sm"
        />
        <Button
          label="Book Service"
          className="p-button-primary bg-gray-800 text-white p-button-sm"
        />
      </div>
    </div>
  );
};

export default Services;
