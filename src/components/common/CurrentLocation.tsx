import React from 'react';
import { Card } from 'primereact/card';

interface LocationData {
  name: string;
  description: string;
}

interface CurrentLocationProps {
  location: LocationData;
  className?: string;
}

const CurrentLocation: React.FC<CurrentLocationProps> = ({ location, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-lg font-medium text-gray-700 mb-3 text-center">Current Location</h2>
      <Card className="bg-indigo-50 border border-indigo-100">
        <div className="flex flex-col items-center text-center">
          <div>
            <h3 className="text-indigo-700 font-medium mb-1 text-center">
              {location.name}
            </h3>
            <p className="text-indigo-600 text-center">
              {location.description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CurrentLocation;
