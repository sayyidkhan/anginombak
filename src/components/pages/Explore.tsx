import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useNavigate, Link } from 'react-router-dom';
import { 
  APP_NAME, 
  BUTTON_LABELS,
  APP_DESCRIPTION
} from '../../utils/constants';
import windsurfIcon from '../../assets/windsurf.svg';

const Explore: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [adventureIdea] = useState('');
  const [savedAdventures, setSavedAdventures] = useState<any[]>([]);
  const [trendingAdventures, setTrendingAdventures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('anginombak_username');
    setUsername(storedUsername);
    
    // Simulate loading adventures
    setTimeout(() => {
      // Mock data for saved adventures - in a real app, this would come from an API
      const mockSavedAdventures = storedUsername ? [
        {
          id: 'saved-1',
          title: 'Family Beach Day',
          location: 'East Coast Park',
          checkpoints: 3,
          lastPlayed: '2 days ago',
          progress: 67,
          isPublic: false
        },
        {
          id: 'saved-2',
          title: 'City Exploration',
          location: 'Downtown Core',
          checkpoints: 5,
          lastPlayed: '1 week ago',
          progress: 40,
          isPublic: true
        }
      ] : [];
      
      // Mock data for trending adventures
      const mockTrendingAdventures = [
        {
          id: 'trend-1',
          title: 'Urban Explorer',
          location: 'Singapore Downtown',
          checkpoints: 5,
          creator: 'adventure_master',
          participants: 24,
          rating: 4.7
        },
        {
          id: 'trend-2',
          title: 'Nature Trail',
          location: 'Bukit Timah Nature Reserve',
          checkpoints: 3,
          creator: 'nature_lover',
          participants: 18,
          rating: 4.5
        },
        {
          id: 'trend-3',
          title: 'Historical Journey',
          location: 'Chinatown',
          checkpoints: 4,
          creator: 'history_buff',
          participants: 32,
          rating: 4.8
        },
        {
          id: 'trend-4',
          title: 'Food Adventure',
          location: 'Hawker Centers Tour',
          checkpoints: 6,
          creator: 'foodie_explorer',
          participants: 45,
          rating: 4.9
        }
      ];
      
      setSavedAdventures(mockSavedAdventures);
      setTrendingAdventures(mockTrendingAdventures);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleCreateNew = () => {
    // If user entered an adventure idea, pass it to the prompt page
    if (adventureIdea.trim()) {
      navigate(`/prompt?idea=${encodeURIComponent(adventureIdea)}`);
    } else {
      navigate('/prompt');
    }
  };
  
  const handleContinueAdventure = (adventureId: string) => {
    // In a real app, this would load the saved adventure state
    console.log(`Continuing adventure ${adventureId}`);
    navigate(`/prompt-response?adventure=${adventureId}`);
  };
  
  const handleJoinAdventure = (adventureId: string) => {
    // In a real app, this would make an API call to join the adventure
    console.log(`Joining adventure ${adventureId}`);
    navigate(`/prompt-response?adventure=${adventureId}`);
  };
  
  // Format progress bar
  const renderProgressBar = (progress: number) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-indigo-500 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };
  
  // Format rating with stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        <span className="mr-1 font-medium">{rating.toFixed(1)}</span>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-lg">
              {i < fullStars ? '★' : (i === fullStars && hasHalfStar ? '⯨' : '☆')}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={windsurfIcon} alt="Windsurf" className="w-10 h-10 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">{APP_NAME}</h1>
                <p className="text-sm opacity-90">Embark on Your Next Great Adventure!</p>
              </div>
            </div>
            <div className="flex items-center">
              {username ? (
                <div className="flex items-center">
                  <span className="text-white mr-4">Welcome, {username}</span>
                  <Link to="/login" className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    <i className="pi pi-sign-out mr-1"></i>
                    Sign Out
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="text-white opacity-80 hover:opacity-100 transition-opacity">
                  <i className="pi pi-sign-in mr-1"></i>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Welcome to {APP_NAME}!</h2>
            <p className="text-gray-600 mb-4">{APP_DESCRIPTION} Create custom adventures, explore new places, and share your experiences with friends.</p>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Start a New Adventure</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  label={BUTTON_LABELS.GET_STARTED || "Get Started"}
                  icon="pi pi-plus"
                  onClick={handleCreateNew}
                  className="px-4 py-2 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Saved Adventures Section */}
        {savedAdventures.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Saved Adventures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedAdventures.map(adventure => (
                <div 
                  key={adventure.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{adventure.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{adventure.location}</p>
                    
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{adventure.checkpoints}</span> checkpoints
                      </div>
                      <div className="text-sm text-gray-600">
                        Last played: {adventure.lastPlayed}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{adventure.progress}%</span>
                      </div>
                      {renderProgressBar(adventure.progress)}
                    </div>
                    
                    <Button
                      label="Continue"
                      icon="pi pi-play"
                      onClick={() => handleContinueAdventure(adventure.id)}
                      className="w-full p-2 text-white bg-green-500 hover:bg-green-600 border-none rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Trending Adventures Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trending Adventures</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-indigo-500 text-xl">Loading adventures...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingAdventures.map(adventure => (
                <div 
                  key={adventure.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <h4 className="text-lg font-bold">{adventure.title}</h4>
                      <p className="text-xs opacity-90">{adventure.location}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{adventure.checkpoints}</span> checkpoints
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{adventure.participants}</span> joined
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-600">
                        By <span className="font-medium">{adventure.creator}</span>
                      </div>
                      {renderRating(adventure.rating)}
                    </div>
                    
                    <Button
                      label={BUTTON_LABELS.JOIN_ADVENTURE || "Join Adventure"}
                      onClick={() => handleJoinAdventure(adventure.id)}
                      className="w-full p-2 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm opacity-80">&copy; 2025 {APP_NAME}. All rights reserved.</p>
              <p className="text-xs opacity-60 mt-1">Version 1.0.0</p>
            </div>
            <div className="flex gap-6">
              <Link to="/prompt" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
                Create Adventure
              </Link>
              <Link to="/login" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
                Account
              </Link>
              <a href="#" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
                Community
              </a>
              <a href="#" className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Explore;
