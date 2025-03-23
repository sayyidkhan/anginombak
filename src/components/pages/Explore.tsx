import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProgressBar } from 'primereact/progressbar';
import { FileUpload } from 'primereact/fileupload';
import { Carousel } from 'primereact/carousel';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CurrentLocation from '../common/CurrentLocation';
import ExplorePageStepper from '../common/ExplorePageStepper';
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
  media?: string[]; // Array of media URLs (photos/videos)
  mediaNames?: string[]; // Array of media filenames
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
  checkpoint_counter: number; // Track the current checkpoint index
}

const Explore: React.FC = () => {
  const [adventure, setAdventure] = useState<AdventureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCheckpoint, setActiveCheckpoint] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [expandedCheckpoints, setExpandedCheckpoints] = useState<number[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load adventure data
  useEffect(() => {
    const loadAdventure = async () => {
      try {
        setLoading(true);
        
        // Check if we have an adventureId in the location state (from PromptResponse page)
        const adventureId = location.state?.adventureId || new URLSearchParams(location.search).get('id');
        
        if (!adventureId) {
          console.error('No adventure ID provided');
          navigate('/home');
          return;
        }
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to load adventure from local storage
        const storedAdventures = JSON.parse(localStorage.getItem('anginombak_adventures') || '[]');
        const foundAdventure = storedAdventures.find((adv: any) => adv.id === adventureId);
        
        if (foundAdventure) {
          console.log('Loaded adventure from local storage:', foundAdventure);
          setAdventure(foundAdventure);
          setActiveCheckpoint(foundAdventure.checkpoint_counter || 0);
          setExpandedCheckpoints([foundAdventure.checkpoint_counter || 0]);
        } else {
          // Fall back to mock data if not found in local storage
          console.log('Adventure not found in local storage, using mock data');
          
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
                completed: false,
                timestamp: '',
                location: 'Financial District'
              },
              {
                id: 2,
                title: 'Checkpoint 1',
                description: 'Visit the bank to understand savings accounts and interest rates.',
                completed: false,
                timestamp: '',
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
            progress: 0, // 0% complete
            checkpoint_counter: 0 // Start at the first checkpoint (Starting Point)
          };
          
          setAdventure(mockAdventure);
          setActiveCheckpoint(0);
          setExpandedCheckpoints([0]);
        }
        
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
  
  // Add custom CSS for the file upload and carousel
  useEffect(() => {
    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      /* Custom FileUpload styling */
      .custom-file-upload .p-fileupload-content {
        display: flex;
        flex-direction: column;
      }
      
      .custom-file-upload .p-fileupload-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-bottom: 1rem;
      }
      
      .custom-file-upload .p-fileupload-filename {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      /* Remove the ::after pseudo-element that adds the second Pending status */
      /*.custom-file-upload .p-fileupload-filename::after {
        content: 'Pending';
        background-color: #f97316;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.75rem;
      }*/
      
      .custom-file-upload .p-progressbar {
        height: 0.5rem;
        border-radius: 0;
        margin-top: 0.25rem;
      }
      
      /* Carousel navigation styling */
      .p-carousel .p-carousel-indicators {
        margin-top: 0.5rem;
      }
      
      .p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button {
        background-color: #6366F1;
      }
      
      .p-carousel .p-carousel-prev,
      .p-carousel .p-carousel-next {
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 50%;
        margin: 0 0.5rem;
        width: 2.5rem;
        height: 2.5rem;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .p-carousel .p-carousel-prev:hover,
      .p-carousel .p-carousel-next:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
      
      .p-carousel .p-carousel-prev span,
      .p-carousel .p-carousel-next span {
        color: white;
        font-size: 1.25rem;
        font-weight: bold;
      }
      
      /* Fix for icon visibility */
      .p-carousel .p-carousel-prev .p-icon,
      .p-carousel .p-carousel-next .p-icon {
        color: white !important;
        font-size: 1.25rem !important;
        visibility: visible !important;
        display: block !important;
      }
      
      /* Make the remove button more obvious */
      .custom-file-upload .p-fileupload-row .p-button.p-fileupload-remove {
        position: absolute !important;
        top: 0.5rem !important;
        right: 0.5rem !important;
        z-index: 10 !important;
        background-color: rgba(239, 68, 68, 0.9) !important;
        color: white !important;
        border: none !important;
        width: 2rem !important;
        height: 2rem !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
      }
      
      .custom-file-upload .p-fileupload-row .p-button.p-fileupload-remove:hover {
        background-color: rgb(239, 68, 68) !important;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3) !important;
      }
      
      .custom-file-upload .p-fileupload-row .p-button.p-fileupload-remove .p-button-icon {
        font-size: 1rem !important;
        font-weight: bold !important;
      }
      
      /* Enhanced carousel styling for mobile */
      .carousel-container {
        width: 100vw !important;
        max-width: 100vw !important;
        margin: 0 !important;
        padding: 0 !important;
        left: 0 !important;
        right: 0 !important;
      }
      
      /* Force carousel to start from first item */
      .p-carousel .p-carousel-content .p-carousel-items-content {
        transform: translate3d(0, 0, 0) !important;
      }
      
      .p-carousel .p-carousel-indicators {
        justify-content: center !important;
      }
      
      .p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button {
        background-color: #6366F1 !important;
      }
      
      .carousel-item {
        min-height: 250px;
        display: flex;
        flex-direction: column;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .carousel-image-container {
        width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
      }
      
      .carousel-image {
        width: 100% !important;
        height: auto !important;
        min-height: 250px !important;
        max-height: none !important;
        object-fit: cover !important;
        object-position: center !important;
        display: block !important;
      }
      
      .carousel-overlay {
        padding: 8px 12px !important;
        background-color: rgba(0, 0, 0, 0.7) !important;
      }
      
      /* Match upload preview size */
      .p-fileupload-content img {
        max-width: 100% !important;
        min-height: 250px !important;
        max-height: none !important;
        object-fit: cover !important;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .carousel-container, 
        .p-carousel, 
        .p-carousel-container,
        .p-carousel-items-container,
        .p-carousel-items-content,
        .p-carousel-item {
          width: 100% !important;
          max-width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin: 0 !important;
        }
        
        .p-carousel .p-carousel-content {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding: 0 !important;
        }
        
        .p-carousel .p-carousel-content .p-carousel-items-content {
          width: 100% !important;
          overflow: visible !important;
        }
        
        .carousel-image-container {
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .carousel-image {
          min-height: 350px !important;
          max-height: none !important;
          width: 100% !important;
          object-fit: cover !important;
        }
        
        .carousel-overlay p {
          font-size: 0.75rem !important;
          max-width: 60% !important;
        }
        
        /* Remove padding from carousel container */
        .p-carousel .p-carousel-content .p-carousel-items-container {
          padding: 0 !important;
        }
        
        /* Match file upload preview size */
        .p-fileupload-content img {
          min-height: 350px !important;
          max-height: none !important;
          object-fit: cover !important;
          width: 100% !important;
        }
        
        /* Fix for PrimeReact carousel container */
        .p-carousel-item {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }
        
        .p-carousel-item > div {
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Handle media upload for a checkpoint
  const handleMediaUpload = (event: any, checkpointId: number) => {
    if (!adventure) return;
    
    console.log("Files to upload:", event.files); // Debug log
    
    const files = event.files;
    if (!files || files.length === 0) return;
    
    // In a real app, you would upload these files to a server/storage
    // For now, we'll create local URLs for the files
    const newMediaUrls: string[] = [];
    const newMediaNames: string[] = [];
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileUrl = URL.createObjectURL(file);
      newMediaUrls.push(fileUrl);
      newMediaNames.push(file.name);
      console.log(`Processing file ${i}: ${file.name}, URL: ${fileUrl}`); // Debug log
    }
    
    // Update the checkpoint with the new media
    const updatedCheckpoints = adventure.checkpoints.map(cp => {
      if (cp.id === checkpointId) {
        const updatedMedia = cp.media ? [...cp.media, ...newMediaUrls] : newMediaUrls;
        const updatedMediaNames = cp.mediaNames ? [...cp.mediaNames, ...newMediaNames] : newMediaNames;
        
        console.log("Updated media array:", updatedMedia); // Debug log
        console.log("Updated media names:", updatedMediaNames); // Debug log
        
        return {
          ...cp,
          media: updatedMedia,
          mediaNames: updatedMediaNames
        };
      }
      return cp;
    });
    
    // Update adventure data
    setAdventure({
      ...adventure,
      checkpoints: updatedCheckpoints
    });
    
    // Clear the upload
    event.options.clear();
  };
  
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
      const nextIndex = currentIndex + 1;
      setActiveCheckpoint(nextIndex);
      
      // Update the checkpoint_counter
      setAdventure({
        ...adventure,
        checkpoints: updatedCheckpoints,
        progress: newProgress,
        checkpoint_counter: nextIndex
      });
      
      // Update expanded checkpoints - collapse previous and expand next
      setExpandedCheckpoints([nextIndex]);
    }
  };
  
  // Toggle checkpoint expansion
  const toggleCheckpointExpansion = (index: number) => {
    setActiveCheckpoint(index);
    
    // Update the checkpoint_counter in the adventure data
    if (adventure) {
      setAdventure({
        ...adventure,
        checkpoint_counter: index
      });
    }
    
    // When clicking on a checkpoint, make it the only expanded one
    setExpandedCheckpoints([index]);
  };
  
  // Custom step content renderer
  const renderStepContent = (item: CheckpointData, index: number, isExpanded: boolean, isActive: boolean) => {
    // Special template for community center
    if (item.location === 'Community Center') {
      return (
        <div className={`p-4 border rounded-lg w-full ${
          item.completed ? 'bg-green-50 border-green-200' : 
          (isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200')
        } flex flex-col items-center`}>
          <div 
            className="w-full cursor-pointer"
            onClick={() => toggleCheckpointExpansion(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 text-center">{item.title}</h3>
              {item.completed && (
                <span className="text-sm text-green-600 flex items-center">
                  <i className="pi pi-check-circle mr-1"></i>
                  Completed at {formatDate(item.timestamp)}
                </span>
              )}
              <i className={`pi ${isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'} text-gray-500`}></i>
            </div>
            
            <div className="text-sm text-gray-500 text-center flex items-center justify-center mt-1">
              <i className="pi pi-map-marker mr-1"></i>
              {item.location}
            </div>
          </div>
          
          {isExpanded && (
            <div className="mt-3 w-full">
              <p className="text-gray-600 mb-2 text-center">{item.description}</p>
              
              {/* Display uploaded media if any */}
              {item.media && item.media.length > 0 && (
                <div className="mt-3 w-full">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Media</h4>
                  {item.media.length === 1 ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full">
                        <img 
                          src={item.media[0]} 
                          alt={`Media for ${item.title}`} 
                          className="w-full h-auto rounded-t-md object-contain"
                          style={{ maxHeight: '300px' }}
                        />
                        <div className="bg-gray-800 bg-opacity-70 text-white p-2 absolute bottom-0 w-full rounded-b-md flex justify-between items-center">
                          <p className="text-sm">{item.mediaNames?.[0] || 'Photo'}</p>
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Uploaded</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Carousel 
                      value={item.media} 
                      numVisible={1} 
                      numScroll={1} 
                      className="w-full carousel-container"
                      showNavigators={true}
                      showIndicators={true}
                      style={{ maxWidth: '100%' }}
                      circular={false}
                      autoplayInterval={0}
                      page={0}
                      itemTemplate={(mediaUrl: string) => {
                        const mediaIndex = item.media ? item.media.indexOf(mediaUrl) : 0;
                        return (
                          <div className="flex justify-center p-0 w-full">
                            <div className="relative w-full carousel-item">
                              <div className="w-full carousel-image-container">
                                <img 
                                  src={mediaUrl} 
                                  alt="Uploaded media" 
                                  className="w-full h-auto rounded-t-md carousel-image"
                                  style={{ width: '100%' }}
                                />
                              </div>
                              <div className="bg-gray-800 bg-opacity-70 text-white p-2 absolute bottom-0 w-full rounded-b-md flex justify-between items-center carousel-overlay">
                                <p className="text-sm truncate max-w-[70%]">{item.mediaNames?.[mediaIndex] || `Photo ${mediaIndex + 1}`}</p>
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Uploaded</span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                  )}
                </div>
              )}
              
              {/* Media upload section */}
              <div className="mt-3 w-full">
                <FileUpload
                  name="media"
                  url="./upload" // This would be your actual upload endpoint in a real app
                  accept="image/*,video/*"
                  maxFileSize={10000000}
                  multiple={true}
                  emptyTemplate={<p className="m-0 text-center">Drag and drop photos/videos here</p>}
                  chooseLabel="Add Photo/Video"
                  uploadLabel="Upload"
                  cancelLabel="Cancel"
                  className="w-full custom-file-upload"
                  customUpload={true}
                  uploadHandler={(event) => handleMediaUpload(event, item.id)}
                  previewWidth={300}
                />
              </div>
              
              {!item.completed && isActive && (
                <Button
                  label="Complete Checkpoint"
                  icon="pi pi-check"
                  className="mt-3 bg-indigo-500 hover:bg-indigo-600 border-none text-white"
                  onClick={() => handleCompleteCheckpoint(item.id)}
                />
              )}
            </div>
          )}
        </div>
      );
    }
    
    // Regular template for other checkpoints
    return (
      <div className={`p-4 border rounded-lg w-full ${
        item.completed ? 'bg-green-50 border-green-200' : 
        (isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200')
      }`}>
        <div 
          className="w-full cursor-pointer"
          onClick={() => toggleCheckpointExpansion(index)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
            {item.completed && (
              <span className="text-sm text-green-600 flex items-center">
                <i className="pi pi-check-circle mr-1"></i>
                Completed at {formatDate(item.timestamp)}
              </span>
            )}
            <i className={`pi ${isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'} text-gray-500`}></i>
          </div>
          
          <div className="text-sm text-gray-500">
            <i className="pi pi-map-marker mr-1"></i>
            {item.location}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-3 w-full">
            <p className="text-gray-600 mb-2">{item.description}</p>
            
            {/* Display uploaded media if any */}
            {item.media && item.media.length > 0 && (
              <div className="mt-3 w-full">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Media</h4>
                {item.media.length === 1 ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full">
                      <img 
                        src={item.media[0]} 
                        alt={`Media for ${item.title}`} 
                        className="w-full h-auto rounded-t-md object-contain"
                        style={{ maxHeight: '300px' }}
                      />
                      <div className="bg-gray-800 bg-opacity-70 text-white p-2 absolute bottom-0 w-full rounded-b-md flex justify-between items-center">
                        <p className="text-sm">{item.mediaNames?.[0] || 'Photo'}</p>
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Uploaded</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Carousel 
                    value={item.media} 
                    numVisible={1} 
                    numScroll={1} 
                    className="w-full carousel-container"
                    showNavigators={true}
                    showIndicators={true}
                    style={{ maxWidth: '100%' }}
                    circular={false}
                    autoplayInterval={0}
                    page={0}
                    itemTemplate={(mediaUrl: string) => {
                      const mediaIndex = item.media ? item.media.indexOf(mediaUrl) : 0;
                      return (
                        <div className="flex justify-center p-0 w-full">
                          <div className="relative w-full carousel-item">
                            <div className="w-full carousel-image-container">
                              <img 
                                src={mediaUrl} 
                                alt="Uploaded media" 
                                className="w-full h-auto rounded-t-md carousel-image"
                                style={{ width: '100%' }}
                              />
                            </div>
                            <div className="bg-gray-800 bg-opacity-70 text-white p-2 absolute bottom-0 w-full rounded-b-md flex justify-between items-center carousel-overlay">
                              <p className="text-sm truncate max-w-[70%]">{item.mediaNames?.[mediaIndex] || `Photo ${mediaIndex + 1}`}</p>
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Uploaded</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            )}
            
            {/* Media upload section */}
            <div className="mt-3 w-full">
              <FileUpload
                name="media"
                url="./upload" // This would be your actual upload endpoint in a real app
                accept="image/*,video/*"
                maxFileSize={10000000}
                multiple={true}
                emptyTemplate={<p className="m-0">Drag and drop photos/videos here</p>}
                chooseLabel="Add Photo/Video"
                uploadLabel="Upload"
                cancelLabel="Cancel"
                className="w-full custom-file-upload"
                customUpload={true}
                uploadHandler={(event) => handleMediaUpload(event, item.id)}
                previewWidth={300}
              />
            </div>
            
            {!item.completed && isActive && (
              <Button
                label="Complete Checkpoint"
                icon="pi pi-check"
                className="mt-3 bg-indigo-500 hover:bg-indigo-600 border-none text-white w-full"
                onClick={() => handleCompleteCheckpoint(item.id)}
              />
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Custom step marker renderer
  const renderStepMarker = (item: CheckpointData, _index: number, isActive: boolean) => {
    return (
      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
        item.completed ? 'bg-green-500 text-white' : 
        (isActive ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600')
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
            
            {/* Current Location Component */}
            {activeCheckpoint !== null && (
              <CurrentLocation 
                location={{
                  name: adventure.checkpoints[activeCheckpoint].location,
                  description: adventure.checkpoints[activeCheckpoint].description
                }}
              />
            )}
            
            {/* Timeline Component */}
            <div className="w-full">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Adventure Timeline</h2>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">Current Step: {adventure.checkpoint_counter}</p>
                <div className="flex space-x-2">
                  <Button 
                    icon="pi pi-chevron-left" 
                    className="p-button-sm bg-indigo-500 hover:bg-indigo-600 text-white border-none"
                    disabled={adventure.checkpoint_counter === 0}
                    onClick={() => {
                      if (adventure.checkpoint_counter > 0) {
                        const newIndex = adventure.checkpoint_counter - 1;
                        setActiveCheckpoint(newIndex);
                        setExpandedCheckpoints([newIndex]);
                        setAdventure({
                          ...adventure,
                          checkpoint_counter: newIndex
                        });
                      }
                    }}
                  />
                  <Button 
                    icon="pi pi-chevron-right" 
                    className="p-button-sm bg-indigo-500 hover:bg-indigo-600 text-white border-none"
                    disabled={adventure.checkpoint_counter === adventure.checkpoints.length - 1}
                    onClick={() => {
                      if (adventure.checkpoint_counter < adventure.checkpoints.length - 1) {
                        const newIndex = adventure.checkpoint_counter + 1;
                        setActiveCheckpoint(newIndex);
                        setExpandedCheckpoints([newIndex]);
                        setAdventure({
                          ...adventure,
                          checkpoint_counter: newIndex
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <ExplorePageStepper 
                steps={adventure.checkpoints}
                activeStep={activeCheckpoint || 0}
                expandedSteps={expandedCheckpoints}
                onStepClick={toggleCheckpointExpansion}
                renderStepContent={renderStepContent}
                renderStepMarker={renderStepMarker}
                isCheckpointData={true}
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
                    navigate('/marketplace');
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
