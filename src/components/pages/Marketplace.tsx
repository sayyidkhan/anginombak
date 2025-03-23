import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import MainLayout from '../layout/MainLayout';
import './Marketplace.css';

// Import images
import nature from '../../assets/nature.jpg';
import studio from '../../assets/studio.jpg';
import coding from '../../assets/coding.jpg';
import music from '../../assets/music.jpg';
import sports from '../../assets/sports.jpg';
import cooking from '../../assets/cooking.jpg';
import language from '../../assets/language.jpg';
import robotics from '../../assets/robotics.jpg';
import drama from '../../assets/drama.jpg';

interface Vendor {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  price: string;
  rating: number;
}

const vendors: Vendor[] = [
  {
    id: 1,
    name: 'Nature Explorers',
    image: nature,
    description: 'Join our family-friendly nature walks and workshops. Learn about local flora and fauna while having fun!',
    category: 'Nature & Science',
    price: 'From $50',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Creative Arts Studio',
    image: studio,
    description: 'Engage your kids in creative arts workshops. From painting to pottery, we have something for everyone!',
    category: 'Arts & Crafts',
    price: 'From $45',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Coding for Kids',
    image: coding,
    description: 'Introduce your children to the world of coding with our fun and interactive workshops.',
    category: 'Technology',
    price: 'From $60',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Music Makers',
    image: music,
    description: 'Learn music together as a family. Choose from piano, guitar, or group classes.',
    category: 'Music & Dance',
    price: 'From $70',
    rating: 4.8
  },
  {
    id: 5,
    name: 'Sports Academy',
    image: sports,
    description: 'Family-friendly sports classes for all ages. From soccer to swimming, find your perfect activity!',
    category: 'Sports & Fitness',
    price: 'From $55',
    rating: 4.9
  },
  {
    id: 6,
    name: 'Cooking Together',
    image: cooking,
    description: 'Family cooking classes that teach kids and parents how to cook delicious meals together.',
    category: 'Cooking & Baking',
    price: 'From $40',
    rating: 4.8
  },
  {
    id: 7,
    name: 'Language Learning',
    image: language,
    description: 'Fun and interactive language classes for kids and families. Learn a new language together!',
    category: 'Languages',
    price: 'From $50',
    rating: 4.7
  },
  {
    id: 8,
    name: 'Robotics Club',
    image: robotics,
    description: 'Hands-on robotics workshops that teach STEM concepts through fun projects.',
    category: 'Technology',
    price: 'From $65',
    rating: 4.8
  },
  {
    id: 9,
    name: 'Drama Workshop',
    image: drama,
    description: 'Express yourself through drama and theater. Perfect for building confidence and creativity.',
    category: 'Arts & Performance',
    price: 'From $45',
    rating: 4.9
  }
];

const Marketplace: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        {/* Points Tracking Card */}
        <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">My Rewards Points</h2>
              <div className="flex items-center">
                <i className="pi pi-star-fill mr-2 text-yellow-300"></i>
                <span className="text-4xl font-bold">500</span>
                <span className="ml-2 text-yellow-200">points</span>
              </div>
              <p className="mt-2 text-sm text-yellow-100">
                Complete adventures to earn more points!
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Points Value</h3>
              <div className="flex items-center">
                <span className="text-xl font-bold">100 points = 1 SGD</span>
              </div>
              <p className="mt-2 text-sm">
                Current balance value: <span className="font-bold">5.00 SGD</span>
              </p>
              <Button 
                label="Redeem Points" 
                icon="pi pi-shopping-cart"
                className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-none"
              />
            </div>
          </div>
        </div>

        {/* Points History Section */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Points History</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-03-23</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Completed Adventure: East Coast Park</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">+200</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-03-20</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Completed Adventure: Gardens by the Bay</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">+150</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-03-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Completed Adventure: Sentosa Island</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">+150</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              label="View All History" 
              icon="pi pi-history"
              className="bg-gray-500 hover:bg-gray-600 text-white border-none"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Marketplace</h1>
          <div className="flex gap-2">
            <Button
              label="Filter"
              icon="pi pi-filter"
              className="p-button-outlined bg-indigo-500 text-white hover:bg-indigo-600"
            />
            <Button
              label="Sort"
              icon="pi pi-sort"
              className="p-button-outlined bg-indigo-500 text-white hover:bg-indigo-600"
            />
            <Button
              label="Social"
              icon="pi pi-users"
              className="p-button-outlined bg-indigo-500 text-white hover:bg-indigo-600"
              onClick={() => window.location.href = '/social'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Card 
              key={vendor.id}
              className="shadow-lg p-4 bg-white rounded-xl hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="relative h-48 w-full">
                  <img 
                    src={vendor.image} 
                    alt={vendor.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-white text-sm px-2 py-1 rounded-full">
                    {vendor.rating}⭐
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  <h3 className="font-medium mb-2">{vendor.name}</h3>
                  <p className="text-gray-600 mb-2">{vendor.category}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{vendor.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{vendor.price}</span>
                    <Button 
                      label="Learn More"
                      className="p-button-outlined bg-indigo-500 text-white hover:bg-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Marketplace;
