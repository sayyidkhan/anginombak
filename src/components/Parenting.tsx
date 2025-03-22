import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const Parenting: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Parenting Resources</h1>
        <button className="text-2xl">≡</button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-pink-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Child Development</h3>
              <p className="text-sm text-gray-600">Stages and milestones</p>
            </div>
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Behavior Management</h3>
              <p className="text-sm text-gray-600">Positive discipline</p>
            </div>
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Education</h3>
              <p className="text-sm text-gray-600">Learning at home</p>
            </div>
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Health & Wellness</h3>
              <p className="text-sm text-gray-600">Nutrition and exercise</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Articles */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="bg-gray-100 h-48 mb-4"></div>
              <h3 className="font-medium mb-2">The Importance of Play in Early Development</h3>
              <p className="text-sm text-gray-600 mb-2">Explore how play contributes to cognitive, social, and emotional growth in young children.</p>
              <div className="flex justify-end">
                <span className="text-blue-600 text-sm">Read more →</span>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="bg-gray-100 h-48 mb-4"></div>
              <h3 className="font-medium mb-2">Building Strong Family Bonds</h3>
              <p className="text-sm text-gray-600 mb-2">Discover practical tips for strengthening relationships within your family unit.</p>
              <div className="flex justify-end">
                <span className="text-blue-600 text-sm">Read more →</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-auto">
        <Button
          label="Save Article"
          className="p-button-outlined p-button-sm"
        />
        <Button
          label="Share"
          className="p-button-primary bg-gray-800 text-white p-button-sm"
        />
      </div>
    </div>
  );
};

export default Parenting;
