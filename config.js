// Configuration for GitHub Pages static site and local development
// For security, we're using a restricted API key for the demo
// In a production environment, you would use a proxy server to make API calls

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Determine if we're running locally or on GitHub Pages
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Configuration for the application
const APP_CONFIG = {
  // API key for Google Maps - using environment variable from window.env
  googleMapsApiKey: (window.env && window.env.GOOGLE_MAPS_API_KEY) || 'YOUR_GOOGLE_MAPS_API_KEY',
  appName: 'TastyGo',
  // Detect if we're running on localhost
  isLocalhost: isLocalhost,
  // Base URL for API calls (not used in demo)
  apiBaseUrl: isLocalhost ? 'http://localhost:5500' : 'https://example.com/api'
};

// Make config available globally
window.APP_CONFIG = APP_CONFIG;

// Track Google Maps loading state
let googleMapsLoadPromise = null;

// Function to load Google Maps API with error handling
window.loadGoogleMapsAPI = function() {
  console.log('loadGoogleMapsAPI called');
  
  // Return existing promise if already loading
  if (googleMapsLoadPromise) {
    console.log('Google Maps API already loading, returning existing promise');
    return googleMapsLoadPromise;
  }

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    try {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('Google Maps API with Places library already loaded');
        resolve(window.google.maps);
        return;
      }

      console.log('Starting Google Maps API load...');
      
      // Get API key from environment variables
      const apiKey = window.env && window.env.GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key not found in environment variables');
        reject(new Error('Google Maps API key not found'));
        return;
      }
      
      console.log('Using API key:', apiKey.substring(0, 8) + '...');

      // Create the script element
      const script = document.createElement('script');
      
      // Set up the callback function - use initMap as the callback
      window.initMap = window.initMap || function() {
        console.log('Google Maps API loaded successfully via callback');
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          console.error('Google Maps API or Places library failed to load properly');
          reject(new Error('Google Maps API not available after load'));
          return;
        }
        resolve(window.google.maps);
      };

      // Configure the script with better error handling
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&v=weekly`;
      script.async = true;
      script.defer = true;
      
      // Add timeout to detect loading failures
      const timeoutId = setTimeout(() => {
        console.error('Google Maps API load timeout');
        googleMapsLoadPromise = null; // Reset promise on timeout
        const mapElement = document.getElementById('map');
        if (mapElement) {
          mapElement.innerHTML = '<div style="text-align: center; padding: 20px;">Error: Map loading timed out. Please check your internet connection and API key.</div>';
        }
        reject(new Error('Google Maps API load timeout'));
      }, 10000); // 10 second timeout

      // Success handler
      script.onload = () => {
        clearTimeout(timeoutId);
        console.log('Google Maps API script loaded');
      };
      
      // Error handler with more detailed error reporting
      script.onerror = (error) => {
        clearTimeout(timeoutId);
        console.error('Failed to load Google Maps API:', error);
        googleMapsLoadPromise = null; // Reset promise on error
        const mapElement = document.getElementById('map');
        if (mapElement) {
          mapElement.innerHTML = `
            <div style="text-align: center; padding: 20px;">
              <p>Error loading Google Maps. Please check:</p>
              <ul style="list-style: none; padding: 0;">
                <li>Your internet connection</li>
                <li>API key configuration</li>
                <li>Domain restrictions in Google Cloud Console</li>
              </ul>
            </div>`;
        }
        reject(new Error('Failed to load Google Maps API'));
      };

      // Add the script to the page
      document.head.appendChild(script);
      console.log('Google Maps API script added to page');
    } catch (error) {
      console.error('Error in loadGoogleMapsAPI:', error);
      googleMapsLoadPromise = null; // Reset promise on error
      reject(error);
    }
  });

  return googleMapsLoadPromise;
};

// Log configuration and environment
console.log('Environment:', APP_CONFIG.isLocalhost ? 'Local Development' : 'Production');
console.log('Current URL:', window.location.href);
console.log('API Base URL:', APP_CONFIG.apiBaseUrl); 