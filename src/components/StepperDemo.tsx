import React from 'react';

const StepperDemo: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Stepper Demo</h1>
        <button className="text-2xl">≡</button>
      </div>
      
      {/* Stepper from the design */}
      <div className="mb-6">
        <div className="relative flex items-center justify-between py-4">
          {/* Horizontal line */}
          <div className="absolute h-0.5 bg-black left-0 right-0"></div>
          
          {/* Starting point with location icon */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-center text-xs">Masjid</div>
            <div className="text-center text-xs">Al-Mawaddah</div>
          </div>
          
          {/* Second point */}
          <div className="flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-black mb-1"></div>
            <div className="text-center text-xs">Sengkang</div>
            <div className="text-center text-xs">Public Library</div>
            <div className="text-xs mt-1">20mins</div>
          </div>
          
          {/* Third point */}
          <div className="flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-black mb-1"></div>
            <div className="text-center text-xs">Kampong</div>
            <div className="text-center text-xs">Lorong Buangkok</div>
            <div className="text-xs mt-1">30mins</div>
          </div>
          
          {/* Fourth point */}
          <div className="flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-black mb-1"></div>
            <div className="text-center text-xs">Jalan Kayu</div>
            <div className="text-xs mt-1">18mins</div>
          </div>
          
          {/* End point with house icon */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative stepper based on image */}
      <div className="mb-6">
        <div className="relative flex items-center justify-between py-4">
          {/* Horizontal line */}
          <div className="absolute h-0.5 bg-cyan-500 left-0 right-0"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center mb-1">
              <span className="text-lg font-medium">1</span>
            </div>
            <div className="text-center text-sm font-medium text-cyan-600">Personal Info</div>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
              <span className="text-lg font-medium text-gray-500">2</span>
            </div>
            <div className="text-center text-sm font-medium text-gray-500">Reservation</div>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
              <span className="text-lg font-medium text-gray-500">3</span>
            </div>
            <div className="text-center text-sm font-medium text-gray-500">Review</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Using the Stepper Component</h2>
        <p className="mb-4">
          The stepper component can be used to show progress through a sequence of steps.
          It's perfect for multi-step forms, checkout processes, or tracking journey progress.
        </p>
        <p>
          You can customize the appearance, icons, and number of steps as needed.
        </p>
      </div>
    </div>
  );
};

export default StepperDemo;
