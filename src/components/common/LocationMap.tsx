import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
// This is needed because the default icons use relative paths that don't work in bundled apps
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'; // Use environment variable

// Declare Google Maps types
declare global {
  interface Window {
    google?: typeof google;
    initGoogleMaps?: () => void;
  }
}

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number, locationName: string) => void;
  selectedLocation: { lat: number, lng: number, name?: string } | null;
}

// Component to handle map clicks
const LocationMarker = ({ onLocationSelect, selectedPosition }: { 
  onLocationSelect: (lat: number, lng: number) => void;
  selectedPosition: [number, number] | null;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return selectedPosition ? (
    <Marker position={selectedPosition} />
  ) : null;
};

// Component to recenter map when position changes
const MapCenterUpdater = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [map, position]);
  
  return null;
};

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
  placeId?: string;
}

const LocationMap = ({ onLocationSelect, selectedLocation }: LocationMapProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  // Load Google Maps API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      // Define the callback function
      window.initGoogleMaps = () => {
        setIsGoogleMapsLoaded(true);
      };
      
      // Create and append the script tag
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      return () => {
        // Clean up
        document.head.removeChild(script);
        if (window.initGoogleMaps) {
          delete window.initGoogleMaps;
        }
      };
    } else if (window.google) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);
  
  // Initialize Google Maps services
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps && isGoogleMapsLoaded) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService (it requires a DOM element)
      const placesDiv = document.createElement('div');
      placesDiv.style.display = 'none';
      document.body.appendChild(placesDiv);
      
      placesServiceRef.current = new google.maps.places.PlacesService(placesDiv);
      
      return () => {
        // Clean up
        if (placesDiv.parentNode) {
          document.body.removeChild(placesDiv);
        }
      };
    }
  }, [isGoogleMapsLoaded]);
  
  // Set initial position to Singapore
  useEffect(() => {
    setPosition([1.3521, 103.8198]);
  }, []);

  // Update position if selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.lat, selectedLocation.lng]);
      if (selectedLocation.name) {
        setLocationName(selectedLocation.name);
      }
    }
  }, [selectedLocation]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get location name from coordinates using reverse geocoding
  const getLocationName = async (lat: number, lng: number) => {
    try {
      if (placesServiceRef.current && isGoogleMapsLoaded) {
        // Use Google Maps Geocoding API
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(lat, lng),
          radius: 100
        };
        
        return new Promise<string>((resolve) => {
          placesServiceRef.current?.nearbySearch(
            request, 
            (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                resolve(results[0].name || 'Location Selected');
              } else {
                resolve('Location Selected');
              }
            }
          );
        });
      }
      
      // Fallback to OpenStreetMap if Google Maps is not loaded
      const nominatimResponse = await fetch(
        `/nominatim/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const nominatimData = await nominatimResponse.json();
      
      if (nominatimData.display_name) {
        // Simplify the display name by taking just the first part (usually the most specific)
        const parts = nominatimData.display_name.split(',');
        return parts.slice(0, 2).join(',');
      }
      
      return 'Location Selected';
    } catch (err) {
      console.error('Error getting location name:', err);
      return 'Location Selected';
    }
  };

  // Update the location name display to include coordinates
  const formatLocationDisplay = (name: string, lat: number, lng: number) => {
    return `${name} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setIsLoading(true);
    
    try {
      const name = await getLocationName(lat, lng);
      const formattedLocation = formatLocationDisplay(name, lat, lng);
      setLocationName(formattedLocation);
      onLocationSelect(lat, lng, name);
      setLocationSelected(true);
    } catch (error) {
      console.error('Error getting location name:', error);
      onLocationSelect(lat, lng, 'Location Selected');
    } finally {
      setIsLoading(false);
    }
    
    setError('');
  };

  const handleCurrentLocation = () => {
    setIsLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newPosition: [number, number] = [lat, lng];
          setPosition(newPosition);
          
          try {
            const name = await getLocationName(lat, lng);
            const formattedLocation = formatLocationDisplay(name, lat, lng);
            setLocationName(formattedLocation);
            onLocationSelect(lat, lng, name);
            setLocationSelected(true);
          } catch (error) {
            console.error('Error getting location name:', error);
            onLocationSelect(lat, lng, 'Current Location');
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to get your current location. Please allow location access or enter a location name.');
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  };

  // Search for location suggestions using Google Places Autocomplete
  const searchLocationSuggestions = (query: string) => {
    if (!query.trim() || query.length < 3 || !autocompleteServiceRef.current || !isGoogleMapsLoaded) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    
    // Focus on Singapore by default
    const singaporeBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(1.1358, 103.6043), // Southwest
      new google.maps.LatLng(1.4655, 104.0884)  // Northeast
    );
    
    const request: google.maps.places.AutocompletionRequest = {
      input: query,
      bounds: singaporeBounds,
      componentRestrictions: { country: 'sg' }, // Focus on Singapore
      types: ['geocode', 'establishment']
    };
    
    autocompleteServiceRef.current.getPlacePredictions(
      request,
      (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Process predictions
          const newSuggestions: LocationSuggestion[] = [];
          
          predictions.forEach((prediction: google.maps.places.AutocompletePrediction) => {
            newSuggestions.push({
              name: prediction.description,
              lat: 0, // Will be filled when selected
              lng: 0, // Will be filled when selected
              placeId: prediction.place_id
            });
          });
          
          setSuggestions(newSuggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
      }
    );
  };
  
  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isGoogleMapsLoaded) {
        searchLocationSuggestions(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, isGoogleMapsLoaded]);
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 3) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    // Hide the suggestions dropdown
    setShowSuggestions(false);
    setIsLoading(true);
    
    if (suggestion.placeId && placesServiceRef.current) {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: suggestion.placeId,
        fields: ['geometry', 'name', 'formatted_address']
      };
      
      placesServiceRef.current.getDetails(
        request,
        (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            // Create a more descriptive location name with coordinates
            const displayName = `${suggestion.name} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            
            // Set the location name explicitly 
            setLocationName(displayName);
            setPosition([lat, lng]);
            onLocationSelect(lat, lng, suggestion.name);
            
            // Clear the search field
            setSearchTerm('');
            
            // Set selected state last
            setLocationSelected(true);
            setIsLoading(false);
            
            // Debug log to verify the location name is set
            console.log("Set location name to:", displayName);
          } else {
            setError('Could not get details for the selected location');
            setIsLoading(false);
          }
        }
      );
    } else if (suggestion.lat && suggestion.lng) {
      // If we already have coordinates
      const lat = suggestion.lat;
      const lng = suggestion.lng;
      
      // Create a more descriptive location name with coordinates
      const displayName = `${suggestion.name} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      
      // Set the location name explicitly
      setLocationName(displayName);
      setPosition([lat, lng]);
      onLocationSelect(lat, lng, suggestion.name);
      
      // Clear the search field
      setSearchTerm('');
      
      // Set selected state last
      setLocationSelected(true);
      setIsLoading(false);
      
      // Debug log to verify the location name is set
      console.log("Set location name to:", displayName);
    }
  };
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a location name');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Check if it's a 6-digit Singapore postal code
      if (/^\d{6}$/.test(searchTerm.trim())) {
        const cleanPostalCode = searchTerm.trim();
        
        if (placesServiceRef.current && isGoogleMapsLoaded) {
          // Use Google Maps Geocoding API for postal code lookup
          const geocoder = new google.maps.Geocoder();
          
          geocoder.geocode(
            { 
              address: cleanPostalCode,
              componentRestrictions: { 
                country: 'sg',
                postalCode: cleanPostalCode 
              }
            },
            (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                const place = results[0];
                if (place.geometry && place.geometry.location) {
                  const lat = place.geometry.location.lat();
                  const lng = place.geometry.location.lng();
                  
                  // Get a readable name from the address components
                  let name = '';
                  if (place.address_components) {
                    // Try to get neighborhood or sublocality first
                    const neighborhood = place.address_components.find(
                      component => component.types.includes('neighborhood') || 
                                  component.types.includes('sublocality_level_1')
                    );
                    
                    if (neighborhood) {
                      name = `${neighborhood.long_name} (${cleanPostalCode})`;
                    } else {
                      // Fallback to locality (city/town)
                      const locality = place.address_components.find(
                        component => component.types.includes('locality')
                      );
                      
                      if (locality) {
                        name = `${locality.long_name} (${cleanPostalCode})`;
                      } else {
                        name = `Singapore (${cleanPostalCode})`;
                      }
                    }
                  } else {
                    name = `Singapore (${cleanPostalCode})`;
                  }
                  
                  const formattedLocation = formatLocationDisplay(name, lat, lng);
                  setPosition([lat, lng]);
                  setLocationName(formattedLocation);
                  onLocationSelect(lat, lng, name);
                  setLocationSelected(true);
                  
                  // Update the search term with formatted location
                  setSearchTerm(formattedLocation);
                  
                  // Force the input to update immediately
                  if (searchInputRef.current) {
                    searchInputRef.current.value = formattedLocation;
                  }
                }
              } else {
                // If Google geocoding fails, try a text search instead
                const request: google.maps.places.TextSearchRequest = {
                  query: `Singapore ${cleanPostalCode}`,
                  region: 'sg'
                };
                
                placesServiceRef.current?.textSearch(
                  request,
                  (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                      const place = results[0];
                      if (place.geometry && place.geometry.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        const name = `${place.name || 'Singapore'} (${cleanPostalCode})`;
                        
                        const formattedLocation = formatLocationDisplay(name, lat, lng);
                        setPosition([lat, lng]);
                        setLocationName(formattedLocation);
                        onLocationSelect(lat, lng, name);
                        setIsLoading(false);
                        setLocationSelected(true);
                        
                        // Update the search term with formatted location
                        setSearchTerm(formattedLocation);
                        
                        // Force the input to update immediately
                        if (searchInputRef.current) {
                          searchInputRef.current.value = formattedLocation;
                        }
                      }
                    } else {
                      setError('Postal code not found. Please try another search term.');
                    }
                    setIsLoading(false);
                  }
                );
              }
              setIsLoading(false);
            }
          );
        } else {
          // Fallback to OpenStreetMap if Google Maps is not loaded
          const response = await fetch(
            `/nominatim/search?format=json&q=${cleanPostalCode},Singapore&limit=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          
          if (!response.ok) {
            throw new Error('Failed to search location');
          }
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            
            const newPosition: [number, number] = [lat, lng];
            setPosition(newPosition);
            
            // Format the address
            const name = `${result.display_name.split(',')[0]} (${cleanPostalCode})`;
            const formattedLocation = formatLocationDisplay(name, lat, lng);
            setLocationName(formattedLocation);
            onLocationSelect(lat, lng, name);
            setIsLoading(false);
            setLocationSelected(true);
            
            // Update the search term with formatted location
            setSearchTerm(formattedLocation);
            
            // Force the input to update immediately
            if (searchInputRef.current) {
              searchInputRef.current.value = formattedLocation;
            }
          } else {
            throw new Error('Postal code not found');
          }
          setIsLoading(false);
        }
      } else if (placesServiceRef.current && isGoogleMapsLoaded) {
        // Use Google Places API for text search
        const request: google.maps.places.TextSearchRequest = {
          query: searchTerm,
          region: 'sg' // Focus on Singapore
        };
        
        placesServiceRef.current.textSearch(
          request,
          (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              const place = results[0];
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const name = place.name || searchTerm;
                
                const formattedLocation = formatLocationDisplay(name, lat, lng);
                setPosition([lat, lng]);
                setLocationName(formattedLocation);
                onLocationSelect(lat, lng, name);
                setIsLoading(false);
                setLocationSelected(true);
                
                // Update the search term with formatted location
                setSearchTerm(formattedLocation);
                
                // Force the input to update immediately
                if (searchInputRef.current) {
                  searchInputRef.current.value = formattedLocation;
                }
              }
            } else {
              setError('Location not found. Please try another search term.');
            }
            setIsLoading(false);
          }
        );
      } else {
        // Fallback to OpenStreetMap if Google Maps is not loaded
        const response = await fetch(
          `/nominatim/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        
        if (!response.ok) {
          throw new Error('Failed to search location');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          
          const newPosition: [number, number] = [lat, lng];
          setPosition(newPosition);
          
          // Format the address
          const name = result.display_name.split(',').slice(0, 2).join(',');
          const formattedLocation = formatLocationDisplay(name, lat, lng);
          setLocationName(formattedLocation);
          onLocationSelect(lat, lng, name);
          setIsLoading(false);
          setLocationSelected(true);
          
          // Update the search term with formatted location
          setSearchTerm(formattedLocation);
          
          // Force the input to update immediately
          if (searchInputRef.current) {
            searchInputRef.current.value = formattedLocation;
          }
        } else {
          throw new Error('Location not found');
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error searching location:', err);
      setError('Location not found. Please try another search term.');
      setIsLoading(false);
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!position) {
    return <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {locationSelected ? (
        <div className="flex flex-col gap-2">
          <div className="bg-indigo-50 p-3 rounded-lg text-indigo-700 font-medium">
            📍 {locationName}
          </div>
          <button 
            onClick={() => {
              setLocationSelected(false);
              setSearchTerm('');
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm"
          >
            Change Location
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 relative z-[9999]">
          <button
            onClick={handleCurrentLocation}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : '📍 Use Current Location'}
          </button>
          
          <div className="flex-1 flex flex-col relative">
            <div className="flex">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter location name or postal code"
                className="flex-1 p-2 border border-gray-300 rounded-l-lg text-sm"
                disabled={isLoading}
                onFocus={() => searchTerm.length >= 3 && setShowSuggestions(true)}
              />
              <button
                onClick={handleSearch}
                className="bg-gray-200 hover:bg-gray-300 px-3 rounded-r-lg text-sm"
                disabled={isLoading}
              >
                Search
              </button>
            </div>
            
            {/* Location suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999]">
                <ul className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs">{error}</p>}
      
      <div className="h-64 rounded-lg overflow-hidden border border-gray-200 relative z-10">
        <MapContainer 
          center={position as L.LatLngExpression} 
          zoom={13} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            onLocationSelect={handleLocationSelect} 
            selectedPosition={position}
          />
          <MapCenterUpdater position={position} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationMap;
