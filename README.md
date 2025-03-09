# TastyGo - Food Delivery Application

A modern food delivery web application built with HTML, CSS, and JavaScript.

## 🔒 Important Security Note

This application requires a Google Maps API key to function properly. For security reasons, the API key is not included in this repository. You must create your own `env.js` file with your API key.

## 🚀 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tastygo.git
cd tastygo
```

2. Create your environment file:
```bash
cp env.example.js env.js
```

3. Get a Google Maps API Key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials)
   - Create a new project or select an existing one
   - Enable these APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API
   - Create credentials (API key)
   - Add your domain to the API key restrictions:
     ```
     http://localhost:5500/*
     http://127.0.0.1:5500/*
     ```

4. Update `env.js` with your API key:
```javascript
window.env = {
  GOOGLE_MAPS_API_KEY: 'your-actual-api-key-here'
};
```

5. Start a local server:
```bash
# Using Python 3
python -m http.server 5500

# Or using Node.js with live-server
npx live-server --port=5500
```

## 🔐 Security Best Practices

1. Never commit `env.js` to version control
2. Keep your API keys private
3. Use proper API key restrictions in Google Cloud Console
4. For production:
   - Use environment variables
   - Add your production domain to API key restrictions
   - Consider using a backend proxy for API calls

## ✨ Features

- User authentication
- Restaurant browsing and filtering
- Food ordering system
- Cart management
- Address management with Google Maps integration
- Dark/Light theme toggle
- Responsive design

## 🛠️ Development

- The application uses vanilla JavaScript
- Styles are managed in `styles.css`
- Main application logic is in `script.js`
- Configuration is handled in `config.js`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details 