import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProgressBar } from 'primereact/progressbar';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { 
  PAGE_TITLES
} from '../../utils/constants';

interface CheckpointData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  timestamp: string;
  location: string;
}

interface AdventureData {
  id: string;
  title: string;
  theme: string;
  startLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  checkpoints: CheckpointData[];
  transportMode: 'Public' | 'Private';
  startTime: string;
  estimatedDuration: number;
  progress: number;
}

const Explore: React.FC = () => {
  const [adventure, setAdventure] = useState<AdventureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCheckpoint, setActiveCheckpoint] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load adventure data
  useEffect(() => {
    const loadAdventure = async () => {
      try {
        // In a real app, you would fetch this data from an API
        // For now, we'll simulate loading data from localStorage
        const queryParams = new URLSearchParams(location.search);
        const adventureId = queryParams.get('id');
        
        if (!adventureId) {
          console.error('No adventure ID provided');
          navigate('/home');
          return;
        }
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for the current adventure
        const mockAdventure: AdventureData = {
          id: adventureId,
          title: 'Financial Adventure in the City',
          theme: 'Financial Literacy',
          startLocation: {
            lat: 1.3521,
            lng: 103.8198,
            name: 'Singapore Downtown'
          },
          checkpoints: [
            {
              id: 1,
              title: 'Starting Point',
              description: 'Begin your adventure here. Learn about financial planning basics.',
              completed: true,
              timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
              location: 'Financial District'
            },
            {
              id: 2,
              title: 'Checkpoint 1',
              description: 'Visit the bank to understand savings accounts and interest rates.',
              completed: true,
              timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
              location: 'Local Bank Branch'
            },
            {
              id: 3,
              title: 'Checkpoint 2',
              description: 'Explore the park while learning about investment options.',
              completed: false,
              timestamp: '',
              location: 'Central Park'
            },
            {
              id: 4,
              title: 'Final Destination',
              description: 'Complete your financial literacy journey at the community center.',
              completed: false,
              timestamp: '',
              location: 'Community Center'
            }
          ],
          transportMode: 'Public',
          startTime: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
          estimatedDuration: 120, // 2 hours
          progress: 50 // 50% complete
        };
        
        setAdventure(mockAdventure);
        
        // Set active checkpoint to the first incomplete one
        const activeIndex = mockAdventure.checkpoints.findIndex(cp => !cp.completed);
        setActiveCheckpoint(activeIndex !== -1 ? activeIndex : mockAdventure.checkpoints.length - 1);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading adventure:', error);
        setLoading(false);
      }
    };
    
    loadAdventure();
  }, [location, navigate]);
  
  // Update time elapsed
  useEffect(() => {
    if (!adventure) return;
    
    const startTime = new Date(adventure.startTime).getTime();
    
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 60000); // minutes
      setTimeElapsed(elapsed);
    }, 60000); // update every minute
    
    // Initial calculation
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 60000); // minutes
    setTimeElapsed(elapsed);
    
    return () => clearInterval(timer);
  }, [adventure]);
  
  // Format time for display
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };
  
  // Format date for display
  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle checkpoint completion
  const handleCompleteCheckpoint = (checkpointId: number) => {
    if (!adventure) return;
    
    // Update the checkpoint
    const updatedCheckpoints = adventure.checkpoints.map(cp => {
      if (cp.id === checkpointId) {
        return {
          ...cp,
          completed: true,
          timestamp: new Date().toISOString()
        };
      }
      return cp;
    });
    
    // Calculate new progress
    const completedCount = updatedCheckpoints.filter(cp => cp.completed).length;
    const totalCheckpoints = updatedCheckpoints.length;
    const newProgress = Math.round((completedCount / totalCheckpoints) * 100);
    
    // Update adventure data
    setAdventure({
      ...adventure,
      checkpoints: updatedCheckpoints,
      progress: newProgress
    });
    
    // Move to next checkpoint
    const currentIndex = adventure.checkpoints.findIndex(cp => cp.id === checkpointId);
    if (currentIndex < adventure.checkpoints.length - 1) {
      setActiveCheckpoint(currentIndex + 1);
    }
  };
  
  // Custom timeline item template
  const timelineItemTemplate = (item: CheckpointData) => {
    // Special case for Final Destination (Community Center)
    if (item.title === 'Final Destination') {
      return (
        <div className={`p-4 border rounded-lg ${
          item.completed ? 'bg-green-50 border-green-200' : 
          (item.id === adventure?.checkpoints[activeCheckpoint || 0].id ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200')
        } flex flex-col items-center`}>
          <h3 className="text-lg font-medium text-gray-800 text-center mb-2">{item.title}</h3>
          
          {item.completed && (
            <span className="text-sm text-green-600 flex items-center mb-2">
              <i className="pi pi-check-circle mr-1"></i>
              Completed at {formatDate(item.timestamp)}
            </span>
          )}
          
          <p className="text-gray-600 mb-2 text-center">{item.description}</p>
          
          <div className="text-sm text-gray-500 text-center flex items-center">
            <i className="pi pi-map-marker mr-1"></i>
            {item.location}
          </div>
          
          {!item.completed && item.id === adventure?.checkpoints[activeCheckpoint || 0].id && (
            <Button
              label="Complete Checkpoint"
              icon="pi pi-check"
              className="mt-3 bg-indigo-500 hover:bg-indigo-600 border-none text-white"
              onClick={() => handleCompleteCheckpoint(item.id)}
            />
          )}
        </div>
      );
    }
    
    // Regular template for other checkpoints
    return (
      <div className={`p-4 border rounded-lg ${
        item.completed ? 'bg-green-50 border-green-200' : 
        (item.id === adventure?.checkpoints[activeCheckpoint || 0].id ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200')
      }`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
          {item.completed && (
            <span className="text-sm text-green-600 flex items-center">
              <i className="pi pi-check-circle mr-1"></i>
              Completed at {formatDate(item.timestamp)}
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-2">{item.description}</p>
        <div className="text-sm text-gray-500">
          <i className="pi pi-map-marker mr-1"></i>
          {item.location}
        </div>
        
        {!item.completed && item.id === adventure?.checkpoints[activeCheckpoint || 0].id && (
          <Button
            label="Complete Checkpoint"
            icon="pi pi-check"
            className="mt-3 bg-indigo-500 hover:bg-indigo-600 border-none text-white"
            onClick={() => handleCompleteCheckpoint(item.id)}
          />
        )}
      </div>
    );
  };
  
  // Custom timeline marker template
  const timelineMarkerTemplate = (item: CheckpointData) => {
    return (
      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
        item.completed ? 'bg-green-500 text-white' : 
        (item.id === adventure?.checkpoints[activeCheckpoint || 0].id ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600')
      }`}>
        {item.completed ? <i className="pi pi-check"></i> : item.id}
      </span>
    );
  };
  
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header pageTitle={PAGE_TITLES.EXPLORE_PAGE_TITLE || "Explore Adventure"} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading adventure data...</p>
          </div>
        ) : adventure ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Adventure Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{adventure.title}</h1>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  adventure.transportMode === 'Public' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <i className={`pi ${adventure.transportMode === 'Public' ? 'pi-ticket' : 'pi-car'} mr-1`}></i>
                  {adventure.transportMode} Transport
                </span>
              </div>
            </div>
            
            {/* Progress and Time */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-gray-700">Adventure Progress</h2>
                <span className="text-indigo-600 font-medium">{adventure.progress}%</span>
              </div>
              <ProgressBar value={adventure.progress} className="h-2" />
              
              <div className="flex flex-col sm:flex-row justify-between mt-4">
                <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                  <i className="pi pi-clock mr-1"></i>
                  Started: {formatDate(adventure.startTime)}
                </div>
                <div className="text-sm text-gray-600">
                  <i className="pi pi-hourglass mr-1"></i>
                  Time elapsed: {formatTime(timeElapsed)} / {formatTime(adventure.estimatedDuration)}
                </div>
              </div>
            </div>
            
            {/* Current Location */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-700 mb-3 text-center">Current Location</h2>
              <Card className="bg-indigo-50 border border-indigo-100">
                <div className="flex flex-col items-center text-center">
                  <div>
                    <h3 className="text-indigo-700 font-medium mb-1 text-center">
                      {adventure.checkpoints[activeCheckpoint || 0].location}
                    </h3>
                    <p className="text-indigo-600 text-center">
                      {adventure.checkpoints[activeCheckpoint || 0].description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Timeline */}
            <div className="w-full">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Adventure Timeline</h2>
              <Timeline 
                value={adventure.checkpoints} 
                content={timelineItemTemplate}
                marker={timelineMarkerTemplate}
                className="custom-timeline w-full"
              />
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <Button
                label="Back to Home"
                icon="pi pi-home"
                onClick={() => navigate('/home')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 border-none"
              />
              
              {adventure.progress === 100 ? (
                <Button
                  label="Complete Adventure"
                  icon="pi pi-flag-fill"
                  className="bg-green-500 hover:bg-green-600 text-white border-none"
                  onClick={() => {
                    alert('Congratulations! You have completed this adventure.');
                    navigate('/home');
                  }}
                />
              ) : (
                <Button
                  label="Share Progress"
                  icon="pi pi-share-alt"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white border-none"
                  onClick={() => {
                    alert('Adventure progress shared!');
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">No Adventure Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the adventure you're looking for. Please start a new adventure or return home.
            </p>
            <Button
              label="Back to Home"
              icon="pi pi-home"
              onClick={() => navigate('/home')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white border-none"
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
