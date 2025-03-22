// Example environment configuration
// IMPORTANT: Copy this file to env.js and add your own API key
// DO NOT commit env.js to GitHub - it should remain private

window.env = {
  // Get your API key from: https://console.cloud.google.com/google/maps-apis/credentials
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY'
};

/* Setup Instructions:
 * 1. Copy this file: cp env.example.js env.js
 * 2. Get a Google Maps API key from Google Cloud Console
 * 3. Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual key in env.js
 * 4. Add these APIs to your project:
 *    - Maps JavaScript API
 *    - Places API
 *    - Geocoding API
 * 5. Add your domain to the API key restrictions:
 *    - For local development: http://localhost:5500/* and http://127.0.0.1:5500/*
 *    - For production: your actual domain
 */ 