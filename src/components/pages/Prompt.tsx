import { useState, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Slider } from 'primereact/slider';
import LocationMap from '../common/LocationMap';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { 
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
  
  // Get username from URL
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usernameParam = queryParams.get('username');
    if (usernameParam) {
      console.log('Username retrieved from URL:', usernameParam);
      
      // Try to load saved form data from localStorage
      try {
        const savedFormData = localStorage.getItem(`anginombak_formData_${usernameParam}`);
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData);
          setPlayer1(parsedData.player1 || '');
          setPlayer2(parsedData.player2 || '');
          setStartLocation(parsedData.startLocation || null);
          setCheckpoints(parsedData.checkpoints || 4);
          setDuration(parsedData.duration || 30);
          setIsPublic(parsedData.isPublic || false);
          console.log('Loaded saved form data for user:', usernameParam);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
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
      // Save form data to localStorage if username exists
      try {
        const formData = {
          player1,
          player2,
          startLocation,
          checkpoints,
          duration,
          isPublic
        };
        localStorage.setItem(`anginombak_formData_${location.search.split('username=')[1]}`, JSON.stringify(formData));
        console.log('Form data saved to localStorage for user:', location.search.split('username=')[1]);
      } catch (error) {
        console.error('Error saving form data:', error);
      }
      
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
          username: location.search.split('username=')[1] 
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
            <div className="mt-2 mb-1 text-sm text-gray-600 font-medium text-left">Suggested prompts:</div>
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
            <div className="mt-2 mb-1 text-sm text-gray-600 font-medium text-left">Suggested prompts:</div>
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
              {[2, 3, 4].map((num) => (
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

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header pageTitle={PAGE_TITLES.PAGE_TITLE} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{PAGE_TITLES.PAGE_TITLE}</h1>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {STEPS.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-indigo-500 h-2.5 rounded-full" 
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Step title */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {isMobile 
              ? MOBILE_CHECKPOINT_TITLES[STEPS[currentStep]] 
              : CHECKPOINT_TITLES[STEPS[currentStep]]}
          </h2>
          
          {/* Step content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button 
              label={BUTTON_LABELS.BACK}
              icon="pi pi-chevron-left"
              onClick={handleBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none"
              disabled={currentStep === 0}
            />
            <Button 
              label={getButtonLabel()}
              icon="pi pi-chevron-right"
              iconPos="right"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-indigo-500 hover:bg-indigo-600 border-none text-white"
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Prompt;
