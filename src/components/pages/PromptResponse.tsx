import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import ReactMarkdown from 'react-markdown';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { generateAdventureContent } from '../../services/GeminiService';
import { 
  PAGE_TITLES, 
  FORM_LABELS
} from '../../utils/constants';

interface PromptData {
  player1: string;
  player2: string;
  startLocation: {lat: number, lng: number, name: string} | null;
  checkpoints: number;
  duration: number;
  isPublic: boolean;
  username: string;
  autoGenerate?: boolean;
}

const PromptResponse: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [transportMode, setTransportMode] = useState<'Public' | 'Private'>('Public');
  const [savedProgress, setSavedProgress] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [adventureContent, setAdventureContent] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get data passed from Prompt component
    if (location.state) {
      const data = location.state as PromptData & { autoGenerate?: boolean };
      setPromptData(data);
      console.log('Received data:', data);
      
      // Auto-generate content if flag is set
      if (data.autoGenerate) {
        handleGenerateAdventure();
      }
      
      // Try to load saved transport mode preference if user has a username
      if (data.username) {
        try {
          const savedTransportMode = localStorage.getItem(`anginombak_transportMode_${data.username}`);
          if (savedTransportMode === 'Public' || savedTransportMode === 'Private') {
            setTransportMode(savedTransportMode);
            console.log('Loaded saved transport mode:', savedTransportMode);
          }
          
          // Try to load saved active step
          const savedStep = localStorage.getItem(`anginombak_activeStep_${data.username}`);
          if (savedStep) {
            const step = parseInt(savedStep, 10);
            if (!isNaN(step) && step >= 0 && step <= data.checkpoints) {
              setActiveStep(step);
              // Initialize expanded steps with only the active one
              setExpandedSteps([step]);
              console.log('Loaded saved active step:', step);
            }
          } else {
            // If no saved step, initialize expanded steps with step 0
            setExpandedSteps([0]);
          }
        } catch (error) {
          console.error('Error loading saved preferences:', error);
          // Initialize expanded steps with step 0 if there's an error
          setExpandedSteps([0]);
        }
      } else {
        // Initialize expanded steps with step 0 if no username
        setExpandedSteps([0]);
      }
    } else {
      // If no data is passed, redirect to prompt page
      console.warn('No data received, redirecting to prompt page');
      navigate('/prompt');
    }
  }, [location, navigate]);
  
  // Save transport mode preference when it changes
  useEffect(() => {
    if (promptData?.username) {
      localStorage.setItem(`anginombak_transportMode_${promptData.username}`, transportMode);
      console.log('Saved transport mode preference:', transportMode);
    }
  }, [transportMode, promptData?.username]);
  
  // Save progress automatically when relevant state changes
  useEffect(() => {
    if (promptData?.username) {
      try {
        const progressData = {
          transportMode,
          activeStep,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`anginombak_progress_${promptData.username}`, JSON.stringify(progressData));
        setSavedProgress(true);
        
        // Reset saved flag after 3 seconds
        setTimeout(() => setSavedProgress(false), 3000);
        
        console.log('Progress auto-saved');
      } catch (error) {
        console.error('Error auto-saving progress:', error);
      }
    }
  }, [transportMode, activeStep, promptData?.username]);
  
  // Toggle step expansion
  const toggleStepExpansion = (index: number) => {
    setActiveStep(index);
    
    // When clicking on a step, make it the only expanded one
    setExpandedSteps([index]);
    
    // Save active step if user has a username
    if (promptData?.username) {
      localStorage.setItem(`anginombak_activeStep_${promptData.username}`, index.toString());
    }
  };
  
  // Format location name for display
  const getLocationName = () => {
    if (!promptData || !promptData.startLocation) return 'Starting Location';
    return promptData.startLocation.name || `Location (${promptData.startLocation.lat.toFixed(4)}, ${promptData.startLocation.lng.toFixed(4)})`;
  };
  
  // Calculate estimated time based on transport mode
  const getEstimatedTime = () => {
    if (!promptData) return 0;
    
    // Calculate time per checkpoint by dividing total duration by number of checkpoints
    const timePerCheckpoint = Math.floor(promptData.duration / promptData?.checkpoints);
    
    // Adjust time based on transport mode
    if (transportMode === 'Public') {
      // Public transport takes longer
      return Math.floor(timePerCheckpoint * 1.5);
    } else {
      // Private transport is faster
      return timePerCheckpoint;
    }
  };
  
  // Get transport mode specific message
  const getTransportMessage = () => {
    if (transportMode === 'Public') {
      return 'Using public transport. Times may vary based on schedules.';
    } else {
      return 'Using private transport for faster travel times.';
    }
  };
  
  // Generate steps for the custom stepper
  const generateSteps = () => {
    if (!promptData) return [];
    
    // Create array with starting point and checkpoints
    const steps = ['Starting Point'];
    for (let i = 1; i <= promptData.checkpoints; i++) {
      steps.push(`Checkpoint ${i}`);
    }
    // Add destination as the final step
    steps.push('Destination');
    
    return steps;
  };
  
  // Render the custom stepper
  const renderCustomStepper = () => {
    const steps = generateSteps();
    
    return (
      <div className="mb-6">
        <div className="text-base font-medium text-gray-700 mb-2">
          {FORM_LABELS.CHECKPOINTS || 'Checkpoints'} ({promptData?.checkpoints || 0})
        </div>
        
        {/* Progress steps */}
        <div className="flex mb-4 relative w-full overflow-x-auto pb-4">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          
          {/* Container for evenly spaced steps */}
          <div className={`grid w-full gap-1`} style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center cursor-pointer px-1"
                onClick={() => toggleStepExpansion(index)}
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
          {steps.map((_, index) => (
            expandedSteps.includes(index) && (
              <div key={index}>
                {index === 0 ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Starting Point</h3>
                    <p className="text-gray-700">{getLocationName()}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Your adventure begins here! Get ready to explore and discover.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {getTransportMessage()}
                    </p>
                    {promptData && (
                      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-indigo-700">
                          <span className="font-medium">Adventure Details:</span> {promptData.player1} and {promptData.player2}
                        </p>
                        <p className="text-sm text-indigo-700 mt-1">
                          <span className="font-medium">Duration:</span> {promptData.duration} minutes
                        </p>
                        <p className="text-sm text-indigo-700 mt-1">
                          <span className="font-medium">Total Checkpoints:</span> {promptData.checkpoints}
                        </p>
                      </div>
                    )}
                  </div>
                ) : index === steps.length - 1 ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Final Destination</h3>
                    <p className="text-gray-700">
                      Congratulations! You've reached your final destination.
                    </p>
                    <div className="mt-4 bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-center">
                        <i className="pi pi-check-circle text-green-500 text-xl mr-2"></i>
                        <h4 className="text-green-700 font-medium text-center">Adventure Created!</h4>
                      </div>
                      <p className="text-green-600 mt-2 text-center">
                        You've successfully completed all checkpoints and reached your destination. 
                        Well done on completing this adventure!
                      </p>
                      {promptData && (
                        <div className="mt-3 text-sm text-green-700 text-center">
                          <p>You've experienced an amazing journey focused on {promptData.player1} and {promptData.player2}.</p>
                          <p className="mt-1">Total journey time: approximately {promptData.duration} minutes.</p>
                        </div>
                      )}
                      <div className="mt-4 flex justify-center">
                        {/* Removed the Start This Journey button from here since it's now in the navigation buttons */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Checkpoint {index}</h3>
                    <p className="text-gray-700">
                      Estimated time to reach: {getEstimatedTime()} minutes
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Complete the challenges at this checkpoint to continue your journey.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {getTransportMessage()}
                    </p>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    );
  };
  
  const handlePrevious = () => {
    const prevStep = Math.max(0, activeStep - 1);
    setActiveStep(prevStep);
    setExpandedSteps([prevStep]);
    
    // Save active step if user has a username
    if (promptData?.username) {
      localStorage.setItem(`anginombak_activeStep_${promptData.username}`, prevStep.toString());
    }
  };
  
  const handleNext = () => {
    const nextStep = Math.min(generateSteps().length - 1, activeStep + 1);
    setActiveStep(nextStep);
    setExpandedSteps([nextStep]);
    
    // Save active step if user has a username
    if (promptData?.username) {
      localStorage.setItem(`anginombak_activeStep_${promptData.username}`, nextStep.toString());
    }
  };
  
  const handleBackToPrompt = () => {
    navigate('/prompt');
  };
  
  const handleGenerateAdventure = async () => {
    try {
      setGenerating(true);
      
      if (!promptData) {
        console.error('No prompt data available');
        return;
      }
      
      const content = await generateAdventureContent(promptData);
      setAdventureContent(content);
      
      // Parse the generated content to extract checkpoint information
      const parseAdventureContent = (content: string | null | undefined) => {
        if (!content) return { parsedContent: {}, checkpointCount: 0 };
        
        try {
          // Initialize result object with a key for each checkpoint
          const result: Record<number, any> = {};
          
          // Split content by checkpoint headings
          // Look for patterns like "Checkpoint 1:", "Checkpoint 2:", etc.
          const checkpointSections = content.split(/(?=\#\#\s*Checkpoint\s*\d+|Starting\s*Point|Final\s*Destination)/gi);
          
          // Process each section
          checkpointSections.forEach((section, index) => {
            // Extract title
            const titleMatch = section.match(/(?:\#\#\s*)?(.*?)(?:\:|\n|$)/);
            const title = titleMatch ? titleMatch[1].trim() : `Checkpoint ${index}`;
            
            // Extract location
            const locationMatch = section.match(/(?:Location\s*\:?\s*)(.*?)(?:\n\s*\-|\n\s*\#|\n\s*Description|\n\s*Activities|\n\s*Estimated|\n\s*Fun Fact|$)/si);
            const location = locationMatch ? locationMatch[1].trim() : `Location ${index}`;
            
            // Extract description
            const descriptionMatch = section.match(/(?:Description\s*\:?\s*)(.*?)(?:\n\s*\-|\n\s*\#|\n\s*Activities|\n\s*Estimated|\n\s*Fun Fact|$)/si);
            const description = descriptionMatch ? descriptionMatch[1].trim() : '';
            
            // Store in result
            result[index] = {
              title,
              location,
              description
            };
          });
          
          return { 
            parsedContent: result, 
            checkpointCount: Object.keys(result).length 
          };
        } catch (error) {
          console.error('Error parsing adventure content:', error);
          return { 
            parsedContent: {}, 
            checkpointCount: 0 
          };
        }
      };
      
      // Parse the generated content
      const parsedContent = parseAdventureContent(content);
      
      // Update the number of checkpoints based on the parsed content
      if (promptData && parsedContent.checkpointCount > 0) {
        setPromptData({
          ...promptData,
          checkpoints: parsedContent.checkpointCount
        });
      }
      
    } catch (error) {
      console.error('Error generating adventure content:', error);
      setAdventureContent(null);
    } finally {
      setGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header pageTitle={PAGE_TITLES.RESPONSE_PAGE_TITLE} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {promptData ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-2 md:mb-0">
                <Button
                  icon="pi pi-chevron-left"
                  label="Re-generate Prompt"
                  onClick={handleBackToPrompt}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none mr-2"
                  tooltip="Back to Prompt"
                />
                <h1 className="text-2xl font-bold text-gray-800">{PAGE_TITLES.RESPONSE_PAGE_TITLE}</h1>
              </div>
              
              {/* Transport mode toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    transportMode === 'Public' 
                      ? 'bg-indigo-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setTransportMode('Public')}
                >
                  Public Transport
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    transportMode === 'Private' 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white border border-gray-300'
                  }`}
                  onClick={() => setTransportMode('Private')}
                >
                  Private Transport
                </button>
              </div>
            </div>
            
            {/* Transport mode message */}
            <div className="mb-6 text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg">
              <i className="pi pi-info-circle mr-2"></i>
              {getTransportMessage()}
            </div>
            
            {/* Stepper */}
            {renderCustomStepper()}
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <Button
                label="Previous"
                icon="pi pi-chevron-left"
                onClick={handlePrevious}
                disabled={activeStep === 0}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none"
              />
              {activeStep === generateSteps().length - 1 ? (
                <Button
                  label="Start This Journey"
                  icon="pi pi-check"
                  className="bg-green-500 hover:bg-green-600 text-white border-none"
                  onClick={() => {
                    if (window.confirm('Are you ready to start this journey?')) {
                      // Parse the adventure content to extract checkpoint information
                      const parseAdventureContent = (content: string | null | undefined) => {
                        if (!content) return { parsedContent: {}, checkpointCount: 0 };
                        
                        try {
                          // Initialize result object with a key for each checkpoint
                          const result: Record<number, any> = {};
                          
                          // Split content by checkpoint headings
                          const checkpointSections = content.split(/(?=\#\#\s*Checkpoint\s*\d+|Starting\s*Point|Final\s*Destination)/gi);
                          
                          // Process each section
                          checkpointSections.forEach((section, index) => {
                            // Extract title
                            const titleMatch = section.match(/(?:\#\#\s*)?(.*?)(?:\:|\n|$)/);
                            const title = titleMatch ? titleMatch[1].trim() : `Checkpoint ${index}`;
                            
                            // Extract location
                            const locationMatch = section.match(/(?:Location\s*\:?\s*)(.*?)(?:\n\s*\-|\n\s*\#|\n\s*Description|\n\s*Activities|\n\s*Estimated|\n\s*Fun Fact|$)/si);
                            const location = locationMatch ? locationMatch[1].trim() : `Location ${index}`;
                            
                            // Extract description
                            const descriptionMatch = section.match(/(?:Description\s*\:?\s*)(.*?)(?:\n\s*\-|\n\s*\#|\n\s*Activities|\n\s*Estimated|\n\s*Fun Fact|$)/si);
                            const description = descriptionMatch ? descriptionMatch[1].trim() : '';
                            
                            // Store in result
                            result[index] = {
                              title,
                              location,
                              description
                            };
                          });
                          
                          return { 
                            parsedContent: result, 
                            checkpointCount: Object.keys(result).length 
                          };
                        } catch (error) {
                          console.error('Error parsing adventure content:', error);
                          return { 
                            parsedContent: {}, 
                            checkpointCount: 0 
                          };
                        }
                      };
                      
                      // Parse the generated content
                      const { parsedContent } = parseAdventureContent(adventureContent);
                      
                      // Create checkpoints based on parsed content
                      const checkpoints = Object.entries(parsedContent).map(([_, value]: [string, any], index) => {
                        return {
                          id: index + 1,
                          title: value.title || `Checkpoint ${index}`,
                          description: value.description || `Checkpoint ${index} of your journey.`,
                          completed: false,
                          timestamp: '',
                          location: value.location || (index === 0 
                            ? promptData?.startLocation?.name || 'Starting Point'
                            : `Location ${index}`)
                        };
                      });
                      
                      // If no checkpoints were parsed, fall back to default checkpoints
                      if (checkpoints.length === 0) {
                        const steps = generateSteps();
                        checkpoints.push(...steps.map((stepName, index) => {
                          let description = '';
                          if (index === 0) {
                            description = `Begin your adventure here. ${promptData?.player1}`;
                          } else if (index === steps.length - 1) {
                            description = `Complete your journey. ${promptData?.player2}`;
                          } else {
                            description = `Checkpoint ${index} of your journey.`;
                          }
                          
                          return {
                            id: index + 1,
                            title: stepName,
                            description: description,
                            completed: false,
                            timestamp: '',
                            location: index === 0 
                              ? promptData?.startLocation?.name || 'Starting Point'
                              : `Location ${index}`
                          };
                        }));
                      }
                      
                      // Create the adventure object
                      const adventure = {
                        id: `adventure_${Date.now()}`,
                        title: `${promptData?.player1} - ${promptData?.player2}`,
                        description: `${promptData?.player1} ${promptData?.player2}`,
                        transportMode: transportMode,
                        startTime: new Date().toISOString(),
                        estimatedDuration: promptData?.duration || 60,
                        progress: 0,
                        checkpoint_counter: 0,
                        generatedContent: adventureContent || null,
                        checkpoints: checkpoints,
                        startLocation: promptData?.startLocation || null
                      };
                      
                      // Store the adventure in local storage
                      try {
                        // Get existing adventures or initialize empty array
                        const existingAdventures = JSON.parse(localStorage.getItem('anginombak_adventures') || '[]');
                        
                        // Add new adventure
                        existingAdventures.push(adventure);
                        
                        // Save back to local storage
                        localStorage.setItem('anginombak_adventures', JSON.stringify(existingAdventures));
                        
                        // Navigate to the explore page with the new adventure ID
                        navigate('/explore', { state: { adventureId: adventure.id } });
                      } catch (error) {
                        console.error('Error saving adventure:', error);
                        alert('There was an error saving your adventure. Please try again.');
                      }
                    }
                  }}
                />
              ) : (
                <Button
                  label="Next"
                  icon="pi pi-chevron-right"
                  iconPos="right"
                  onClick={handleNext}
                  className="bg-indigo-500 hover:bg-indigo-600 border-none text-white"
                />
              )}
            </div>
            
            {/* Auto-save indicator */}
            {savedProgress && (
              <div className="mt-4 text-xs text-green-600 flex items-center justify-end">
                <i className="pi pi-check-circle mr-1"></i>
                Progress saved
              </div>
            )}
            
            {/* Generate adventure button */}
            <Button
              label="Generate Adventure"
              icon="pi pi-play"
              className="bg-orange-500 hover:bg-orange-600 text-white border-none mt-4"
              onClick={handleGenerateAdventure}
            />
            
            {/* Generating indicator */}
            {generating && (
              <div className="mt-4 flex justify-center">
                <ProgressSpinner />
              </div>
            )}
            
            {/* Adventure content */}
            {adventureContent && (
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Adventure Content</h2>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <ReactMarkdown>{adventureContent}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading adventure data...</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PromptResponse;
