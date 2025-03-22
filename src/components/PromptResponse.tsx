import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import windsurfIcon from '../assets/windsurf.svg';

const PromptResponse: React.FC = () => {
  const [transportMode, setTransportMode] = useState<'Public' | 'Private'>('Public');
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">AnginOmbak</h2>
          <img src={windsurfIcon} alt="Windsurf" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl text-gray-600 font-medium text-center">FamilyQuest</h1>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Mode of Transport */}
          <div className="mb-6">
            <div className="text-base mb-2">Mode of Transport</div>
            <div className="flex rounded-md overflow-hidden border">
              <button 
                className={`flex-1 py-2 text-center ${transportMode === 'Public' ? 'bg-white' : 'bg-gray-200'}`}
                onClick={() => setTransportMode('Public')}
              >
                Public
              </button>
              <button 
                className={`flex-1 py-2 text-center ${transportMode === 'Private' ? 'bg-white' : 'bg-gray-200'}`}
                onClick={() => setTransportMode('Private')}
              >
                Private
              </button>
            </div>
          </div>
          
          {/* Event Description */}
          <div className="mb-6">
            <div className="text-base mb-2">Event Description</div>
            <textarea 
              className="w-full border rounded-lg p-3 h-64 resize-none"
              value="Get ready for an exciting adventure filled with fun, learning, and quality bonding time! Your amazing race will take you on a journey through Singapore's rich culture and nature. Starting from Masjid Mawaddah, you'll explore the Sengkang Public Library, where you can dive into books about flowers, insects, and more. Next, you'll visit Kampong Lorong Buangkok, Singapore's last village, to discover native plants and creatures. The adventure will continue through Jalan Kayu, where you'll observe beautiful gardens and fascinating insects. Along the way, take the time to connect, explore, and make lasting memories together as parent and child!"
              readOnly
            />
          </div>
          
          {/* Stepper */}
          <div className="mb-6">
            <div className="relative flex items-center justify-between py-4">
              {/* Horizontal line */}
              <div className="absolute h-0.5 bg-black left-0 right-0"></div>
              
              {/* First location */}
              <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center mb-1">
                  <span className="text-lg font-medium">1</span>
                </div>
                <div className="text-center text-sm font-medium text-gray-700">Masjid</div>
                <div className="text-center text-xs text-gray-700">Al Mawaddah</div>
              </div>
              
              {/* Time indicator 1 */}
              <div className="flex flex-col items-center z-10">
                <div className="bg-white px-2 py-1 rounded-full border border-gray-300">
                  <span className="text-xs font-medium text-gray-500">20min</span>
                </div>
              </div>
              
              {/* Second location */}
              <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
                  <span className="text-lg font-medium text-gray-500">2</span>
                </div>
                <div className="text-center text-sm font-medium text-gray-500">Sengkang</div>
                <div className="text-center text-xs text-gray-500">Public Library</div>
              </div>
              
              {/* Time indicator 2 */}
              <div className="flex flex-col items-center z-10">
                <div className="bg-white px-2 py-1 rounded-full border border-gray-300">
                  <span className="text-xs font-medium text-gray-500">30min</span>
                </div>
              </div>
              
              {/* Third location */}
              <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
                  <span className="text-lg font-medium text-gray-500">3</span>
                </div>
                <div className="text-center text-sm font-medium text-gray-500">Kampong</div>
                <div className="text-center text-xs text-gray-500">Lorong Buangkok</div>
              </div>
              
              {/* Time indicator 3 */}
              <div className="flex flex-col items-center z-10">
                <div className="bg-white px-2 py-1 rounded-full border border-gray-300">
                  <span className="text-xs font-medium text-gray-500">18min</span>
                </div>
              </div>
              
              {/* Fourth location */}
              <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
                  <span className="text-lg font-medium text-gray-500">4</span>
                </div>
                <div className="text-center text-sm font-medium text-gray-500">Jalan Kayu</div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              label="Re-generate"
              className="p-button-outlined p-button-sm"
            />
            <Button
              label="Next"
              className="p-3 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptResponse;
