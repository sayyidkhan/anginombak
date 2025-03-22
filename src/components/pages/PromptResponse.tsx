import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  APP_NAME, 
  PAGE_TITLES, 
  FORM_LABELS, 
  BUTTON_LABELS
} from '../../utils/constants';

interface PromptData {
  player1: string;
  player2: string;
  startLocation: {lat: number, lng: number, name: string} | null;
  checkpoints: number;
  duration: number;
  isPublic: boolean;
  username: string;
}

const PromptResponse: React.FC = () => {
  const [transportMode, setTransportMode] = useState<'Public' | 'Private'>('Public');
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get data passed from Prompt component
    if (location.state) {
      setPromptData(location.state as PromptData);
      console.log('Received data:', location.state);
    } else {
      // If no data is passed, redirect to prompt page
      console.warn('No data received, redirecting to prompt page');
      // Uncomment the line below to enable automatic redirection
      // navigate('/prompt');
    }
  }, [location, navigate]);
  
  // Format location name for display
  const getLocationName = () => {
    if (!promptData || !promptData.startLocation) return 'Starting Location';
    return promptData.startLocation.name || `Location (${promptData.startLocation.lat.toFixed(4)}, ${promptData.startLocation.lng.toFixed(4)})`;
  };
  
  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (!minutes) return '0 minutes';
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  };
  
  // Generate steps for the custom stepper
  const generateSteps = () => {
    if (!promptData) return [];
    
    // Create array with starting point and checkpoints
    const steps = ['Starting Point'];
    for (let i = 1; i <= promptData.checkpoints; i++) {
      // For the last checkpoint, use "Objective" instead
      if (i === promptData.checkpoints) {
        steps.push('Objective');
      } else {
        steps.push(`Checkpoint ${i}`);
      }
    }
    
    return steps;
  };
  
  // Render the custom stepper
  const renderCustomStepper = () => {
    const steps = generateSteps();
    
    return (
      <div className="mb-6">
        <div className="text-base font-medium text-gray-700 mb-2">{FORM_LABELS.CHECKPOINTS || 'Checkpoints'}</div>
        
        {/* Progress steps */}
        <div className="flex mb-4 relative w-full overflow-x-auto pb-4">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          
          {/* Container for evenly spaced steps */}
          <div className={`grid grid-cols-${steps.length} w-full gap-1`} style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((step, index) => (
              <div 
                key={step} 
                className="flex flex-col items-center cursor-pointer px-1"
                onClick={() => setActiveStep(index)}
              >
                {/* Circle indicator */}
                <div 
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mb-1 md:mb-2
                    ${index <= activeStep 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                    ${index < activeStep ? 'ring-2 ring-indigo-300' : ''}
                  `}
                >
                  {index + 1}
                </div>
                
                {/* Step label */}
                <span className={`text-[10px] md:text-xs text-center ${index <= activeStep ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Step content */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
          {activeStep === 0 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Starting Point</h3>
              <p className="text-gray-700">{getLocationName()}</p>
              <p className="text-sm text-gray-500 mt-2">
                Your adventure begins here! Get ready to explore and discover.
              </p>
            </div>
          ) : activeStep === promptData?.checkpoints ? (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Objective</h3>
              <p className="text-gray-700">
                Final destination of your adventure!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Complete all challenges to achieve your objective and finish the adventure.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Checkpoint {activeStep}</h3>
              <p className="text-gray-700">
                Estimated time to reach: {Math.floor(15 + Math.random() * 20)} minutes
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Complete the challenges at this checkpoint to continue your journey.
              </p>
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className={`flex pt-4 ${activeStep < (promptData?.checkpoints || 0) ? 'justify-content-between' : 'justify-content-start'}`}>
          {activeStep > 0 && (
            <Button 
              label="Previous" 
              icon="pi pi-chevron-left" 
              className="px-4 py-2 bg-gray-200 text-gray-800 border-none rounded-lg"
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} 
            />
          )}
          
          {activeStep < (promptData?.checkpoints || 0) && (
            <Button 
              label="Next" 
              icon="pi pi-chevron-right" 
              iconPos="right" 
              className="px-4 py-2 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
              onClick={() => setActiveStep(prev => Math.min((promptData?.checkpoints || 0), prev + 1))} 
            />
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 w-full max-w-2xl mx-4 sm:m-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">{APP_NAME}</h2>
          <h1 className="text-2xl text-gray-600 font-medium text-center">{PAGE_TITLES.RESPONSE_TITLE || 'Your Adventure'}</h1>
          {promptData?.username && (
            <p className="text-lg text-gray-500">Welcome back, {promptData.username} !</p>
          )}
        </div>
        
        {/* Main Content */}
        <div className="min-h-[200px] w-full">
          {/* Transport Mode Selection */}
          <div className="mb-6">
            <div className="text-base font-medium text-gray-700 mb-2">{FORM_LABELS.TRANSPORT_MODE || 'Mode of Transport'}</div>
            <div className="flex rounded-md overflow-hidden border">
              <button 
                className={`flex-1 py-2 text-center transition-colors ${transportMode === 'Public' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setTransportMode('Public')}
              >
                Public
              </button>
              <button 
                className={`flex-1 py-2 text-center transition-colors ${transportMode === 'Private' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setTransportMode('Private')}
              >
                Private
              </button>
            </div>
          </div>
          
          {/* Adventure Details */}
          <div className="mb-6">
            <div className="text-base font-medium text-gray-700 mb-2">{FORM_LABELS.EVENT_DESCRIPTION || 'Event Description'}</div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
              {promptData ? (
                <div className="space-y-3">
                  <p className="text-gray-800">
                    Get ready for an exciting adventure focused on <span className="font-semibold">"{promptData.player1}"</span> and <span className="font-semibold">"{promptData.player2}"</span>!
                  </p>
                  <p className="text-gray-800">
                    Your amazing race will take you on a journey starting from <span className="font-semibold">{getLocationName()}</span> with {promptData.checkpoints} checkpoints over a duration of {formatDuration(promptData.duration)}.
                  </p>
                  <p className="text-gray-800">
                    {promptData.isPublic 
                      ? 'This event is public and can be joined by others.' 
                      : 'This is a private event just for you.'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Loading event details...</p>
              )}
            </div>
          </div>
          
          {/* Custom Stepper for Checkpoints */}
          {promptData && renderCustomStepper()}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            label={BUTTON_LABELS.REGENERATE || "Re-generate"}
            onClick={() => navigate('/prompt')}
            className="px-6 py-2 bg-gray-200 text-gray-800 border-none rounded-lg"
          />
          <Button
            label={BUTTON_LABELS.START || "Start Adventure"}
            onClick={() => alert('Adventure details saved! You can now start your journey.')}
            className="px-6 py-2 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PromptResponse;
