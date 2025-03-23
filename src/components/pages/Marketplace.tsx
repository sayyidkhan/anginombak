import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Header from '../common/Header';
import Footer from '../common/Footer';
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
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Header />
      
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Marketplace</h1>
          <div className="flex gap-2">
            <Button
              label="Filter"
              icon="pi pi-filter"
              className="p-button-outlined"
            />
            <Button
              label="Sort"
              icon="pi pi-sort"
              className="p-button-outlined"
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
                      className="p-button-outlined"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
