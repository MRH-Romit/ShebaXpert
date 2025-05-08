import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// MapBox token - should be in .env in production
mapboxgl.accessToken = 'pk.your_mapbox_token_here';

const MapPage = () => {
  const { user } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lng, setLng] = useState(90.4125); // Default to Dhaka coordinates
  const [lat, setLat] = useState(23.8103);
  const [zoom, setZoom] = useState(11);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Prevent multiple initializations
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 13
          });
          setLng(longitude);
          setLat(latitude);
          
          // Add marker for user location
          new mapboxgl.Marker({ color: '#3FB1CE' })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML('<h3>আপনার অবস্থান</h3>'))
            .addTo(map.current);
            
          // Load providers near user's location
          loadProviders(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Load providers for default location
          loadProviders(lat, lng);
        }
      );
    } else {
      // Load providers for default location
      loadProviders(lat, lng);
    }
    
    // Cleanup function
    return () => map.current.remove();
  }, []);

  // Load service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/services/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Load providers when category changes
  useEffect(() => {
    if (lat && lng) {
      loadProviders(lat, lng, selectedCategory);
    }
  }, [selectedCategory]);

  // Function to load service providers
  const loadProviders = async (latitude, longitude, category = '') => {
    setLoading(true);
    try {
      const url = `/api/services/providers${category ? `/${category}` : ''}`;
      const response = await axios.get(url, {
        params: {
          latitude,
          longitude,
          radius: 5 // 5km radius
        }
      });
      
      setProviders(response.data.providers);
      
      // Clear existing markers
      document.querySelectorAll('.provider-marker').forEach(el => el.remove());
      
      // Add markers for providers
      response.data.providers.forEach(provider => {
        const markerEl = document.createElement('div');
        markerEl.className = 'provider-marker';
        markerEl.style.width = '30px';
        markerEl.style.height = '30px';
        markerEl.style.backgroundImage = 'url(/marker-icon.png)';
        markerEl.style.backgroundSize = 'contain';
        markerEl.style.cursor = 'pointer';
        
        // Create marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([provider.longitude, provider.latitude])
          .addTo(map.current);
          
        // Add click event
        markerEl.addEventListener('click', () => {
          setSelectedProvider(provider);
        });
      });
      
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Filter bar */}
      <div className="bg-white p-4 shadow-md z-10">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">সেবা প্রদানকারী খুঁজুন</h1>
          
          <div className="flex items-center space-x-4">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">সব ধরনের সেবা</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <button 
              onClick={() => loadProviders(lat, lng, selectedCategory)} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'অপেক্ষা করুন...' : 'খুঁজুন'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Map container */}
      <div className="flex-grow flex">
        <div ref={mapContainer} className="flex-grow" />
        
        {/* Provider details panel */}
        {selectedProvider && (
          <div className="w-80 bg-white p-4 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{selectedProvider.name}</h2>
              <button 
                onClick={() => setSelectedProvider(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4 space-y-3">
              <p>
                <span className="font-semibold">সেবা:</span> {selectedProvider.service_category}
              </p>
              <p>
                <span className="font-semibold">ফোন:</span> {selectedProvider.phone}
              </p>
              <p>
                <span className="font-semibold">ঠিকানা:</span> {selectedProvider.address || 'অনির্দিষ্ট'}
              </p>
              <p>
                <span className="font-semibold">দূরত্ব:</span> {selectedProvider.distance?.toFixed(2)} কিমি
              </p>
              <p>
                <span className="font-semibold">বিবরণ:</span> {selectedProvider.description || 'কোন বিবরণ নেই'}
              </p>
              
              <div className="flex space-x-2 mt-4">
                <a 
                  href={`tel:${selectedProvider.phone}`} 
                  className="bg-blue-500 text-white px-3 py-2 rounded text-sm flex-grow text-center"
                >
                  কল করুন
                </a>
                <a 
                  href={`/profile/${selectedProvider.user_id}`} 
                  className="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm flex-grow text-center"
                >
                  প্রোফাইল দেখুন
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;