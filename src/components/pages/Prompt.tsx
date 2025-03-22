import { useState, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Slider } from 'primereact/slider';
import LocationMap from '../common/LocationMap';
import { 
  APP_NAME, 
  PAGE_TITLES, 
  FORM_LABELS, 
  BUTTON_LABELS, 
  PLACEHOLDERS,
  CHECKPOINT_TITLES,
  MOBILE_CHECKPOINT_TITLES,
  PLAYER1_SUGGESTIONS,
  PLAYER2_SUGGESTIONS
} from '../../utils/constants';
import './slider-styles.css';

// Define checkpoint steps
const STEPS = [
  'PLAYER_1',
  'PLAYER_2',
  'START_LOCATION',
  'NUM_CHECKPOINTS',
  'DURATION',
  'MAKE_PUBLIC'
];

const Prompt = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [startLocation, setStartLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [checkpoints, setCheckpoints] = useState(4);
  const [duration, setDuration] = useState(30); 
  const [isPublic, setIsPublic] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState('');
  
  // Get username from URL
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usernameParam = queryParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
      console.log('Username retrieved from URL:', usernameParam);
    }
  }, [location]);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      console.log('Form submitted:', { 
        player1, 
        player2, 
        startLocation, 
        checkpoints, 
        duration,
        isPublic 
      });
      // Navigate to prompt-response page
      navigate('/prompt-response', { 
        state: { 
          player1, 
          player2, 
          startLocation, 
          checkpoints, 
          duration,
          isPublic,
          username 
        } 
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, locationName: string) => {
    setStartLocation({ lat, lng, name: locationName });
    console.log('Location selected:', { lat, lng, name: locationName });
  };

  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  };

  // Format location for display - used for debugging and future display needs
  const formatLocation = (location: {lat: number, lng: number, name?: string} | null) => {
    if (!location) return '';
    if (location.name) return location.name;
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  };

  // For debugging purposes
  useEffect(() => {
    if (startLocation) {
      console.log('Formatted location:', formatLocation(startLocation));
    }
  }, [startLocation]);

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (STEPS[currentStep]) {
      case 'PLAYER_1':
        return player1.trim() !== '';
      case 'PLAYER_2':
        return player2.trim() !== '';
      case 'START_LOCATION':
        return startLocation !== null;
      default:
        return true;
    }
  };

  // Get button label based on current step
  const getButtonLabel = () => {
    return currentStep === STEPS.length - 1 
      ? BUTTON_LABELS.FINISH 
      : BUTTON_LABELS.CONTINUE;
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (STEPS[currentStep]) {
      case 'PLAYER_1':
        return (
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="player1" className="text-gray-700 font-medium">{FORM_LABELS.PLAYER_1}</label>
            <InputTextarea
              id="player1"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="p-3 rounded-lg w-full bg-gray-50 border border-gray-200"
              placeholder={PLACEHOLDERS.PLAYER_NAME}
              autoFocus
              rows={5}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 rounded-full px-4 py-1 bg-transparent border border-indigo-600 hover:border-indigo-800"
                onClick={() => setPlayer1(PLAYER1_SUGGESTIONS.SAVING)}
              >
                Saving
              </button>
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 rounded-full px-4 py-1 bg-transparent border border-indigo-600 hover:border-indigo-800"
                onClick={() => setPlayer1(PLAYER1_SUGGESTIONS.INVESTING)}
              >
                Investing
              </button>
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 rounded-full px-4 py-1 bg-transparent border border-indigo-600 hover:border-indigo-800"
                onClick={() => setPlayer1(PLAYER1_SUGGESTIONS.BUDGETING)}
              >
                Budgeting
              </button>
            </div>
          </div>
        );
      
      case 'PLAYER_2':
        return (
          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="player2" className="text-gray-700 font-medium">{FORM_LABELS.PLAYER_2}</label>
            <InputTextarea
              id="player2"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="p-3 rounded-lg w-full bg-gray-50 border border-gray-200"
              placeholder={PLACEHOLDERS.PLAYER_NAME}
              autoFocus
              rows={5}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 rounded-full px-4 py-1 bg-transparent border border-indigo-600 hover:border-indigo-800"
                onClick={() => setPlayer2(PLAYER2_SUGGESTIONS.VISIT_PARK)}
              >
                Visit Park
              </button>
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 rounded-full px-4 py-1 bg-transparent border border-indigo-600 hover:border-indigo-800"
                onClick={() => setPlayer2(PLAYER2_SUGGESTIONS.VISIT_BEACH)}
              >
                Visit Beach
              </button>
              <button 
                className="text-sm text-indigo-600 hover:text-indigo-800 rounded-full px-4 py-1 bg-transparent border border-indigo-600 hover:border-indigo-800"
                onClick={() => setPlayer2(PLAYER2_SUGGESTIONS.VISIT_HOTSPRINGS)}
              >
                Visit Hotsprings
              </button>
            </div>
          </div>
        );
      
      case 'START_LOCATION':
        return (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-medium">{FORM_LABELS.START_LOCATION}</label>
            </div>
            <LocationMap 
              onLocationSelect={handleLocationSelect}
              selectedLocation={startLocation}
            />
            <p className="text-sm text-gray-500 italic">Click on the map, use your current location, or enter a postal code</p>
          </div>
        );
      
      case 'NUM_CHECKPOINTS':
        return (
          <div className="flex flex-col gap-4">
            <label className="text-gray-700 font-medium">{FORM_LABELS.CHECKPOINTS}</label>
            <div className="flex gap-4 justify-center">
              {[4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`w-16 h-16 flex items-center justify-center rounded-lg text-xl ${
                    checkpoints === num 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => setCheckpoints(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'DURATION':
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-medium">{FORM_LABELS.DURATION}</label>
              <span className="text-indigo-600 font-medium">{formatDuration(duration)}</span>
            </div>
            <div className="px-2 py-6">
              <div className="custom-slider-container">
                <Slider 
                  value={duration} 
                  onChange={(e) => setDuration(e.value as number)} 
                  min={30} 
                  max={120} 
                  step={5}
                  className="w-full custom-slider"
                />
              </div>
              
              {/* Tick marks with improved visibility */}
              <div className="flex justify-between mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
                  <span className="text-xs text-gray-600 mt-1">30 min</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
                  <span className="text-xs text-gray-600 mt-1">1 hour</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-1 h-3 bg-indigo-400 rounded-full"></div>
                  <span className="text-xs text-gray-600 mt-1">2 hours</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'MAKE_PUBLIC':
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-medium">{FORM_LABELS.MAKE_EVENT_PUBLIC}</label>
              <div className="relative inline-block w-14 h-7 rounded-full">
                <input 
                  type="checkbox" 
                  className="opacity-0 w-0 h-0"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  id="toggleSwitch"
                />
                <label 
                  htmlFor="toggleSwitch"
                  className={`
                    absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full 
                    transition-all duration-300 ease-in-out
                    ${isPublic ? 'bg-green-400' : 'bg-gray-300'}
                  `}
                >
                  <span 
                    className={`
                      absolute h-5 w-5 rounded-full bg-white shadow-md
                      transition-all duration-300 ease-in-out
                      top-1 
                      ${isPublic ? 'left-8' : 'left-1'}
                    `}
                  ></span>
                </label>
              </div>
            </div>
            <div className="text-center text-gray-600 mt-2">
              {isPublic 
                ? 'Your event will be visible to other users' 
                : 'Your event will be private'}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render progress indicators
  const renderProgressSteps = () => {
    return (
      <div className="flex mb-8 relative w-full overflow-x-auto pb-4">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        
        {/* Container for evenly spaced steps */}
        <div className="grid grid-cols-6 w-full gap-1">
          {STEPS.map((step, index) => (
            <div 
              key={step} 
              className="flex flex-col items-center cursor-pointer px-1"
              onClick={() => setCurrentStep(index)}
            >
              {/* Circle indicator */}
              <div 
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mb-1 md:mb-2
                  ${index <= currentStep 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                  ${index < currentStep ? 'ring-2 ring-indigo-300' : ''}
                `}
              >
                {index + 1}
              </div>
              
              {/* Step label */}
              <span className={`text-[10px] md:text-xs text-center ${index <= currentStep ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                {isMobile ? MOBILE_CHECKPOINT_TITLES[step] : CHECKPOINT_TITLES[step]}
              </span>
            </div>
          ))}
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
          <h1 className="text-2xl text-gray-600 font-medium text-center">{PAGE_TITLES.PAGE_TITLE}</h1>
          <p className="text-lg text-gray-500">Welcome back, {username} !</p>
        </div>
        
        {/* Progress steps */}
        {renderProgressSteps()}

        {/* Main Content */}
        <div className="min-h-[200px] flex items-center justify-center w-full">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 0 ? (
            <Button
              type="button"
              label={BUTTON_LABELS.BACK}
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 text-gray-800 border-none rounded-lg"
            />
          ) : (
            <Link to="/login" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center">
              {BUTTON_LABELS.BACK}
            </Link>
          )}
          
          <Button
            type="button"
            label={getButtonLabel()}
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-6 py-2 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Prompt;
