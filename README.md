# TastyGo - Food Delivery Application

A modern food delivery web application built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## 🔒 Important Security Notes

1. This application requires a Google Maps API key for the frontend.
2. The backend uses MongoDB Atlas for database storage.
3. API keys and database credentials should be kept private.

## 🚀 Setup Instructions

### Frontend Setup

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
   - Add your domain to the API key restrictions

4. Update `env.js` with your API key:
```javascript
window.env = {
  GOOGLE_MAPS_API_KEY: 'your-actual-api-key-here'
};
```

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a .env file in the root directory:
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/tastygo?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=your_jwt_secret
```

3. Set up MongoDB Atlas:
   - Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user
   - Allow network access (IP Whitelist)
   - Get your connection string
   - Update the .env file with your connection string

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

## 📊 Database Schema

### User Model
- `username`: String (unique)
- `email`: String (unique)
- `password`: String (hashed)
- `fullName`: String
- `addresses`: Array of address objects
- `phoneNumber`: String
- `favorites`: Array of restaurant references
- `orders`: Array of order references

### Restaurant Model
- `name`: String
- `cuisine`: String
- `price`: String ('$', '$$', '$$$', '$$$$')
- `logo`: String (URL)
- `rating`: Number
- `deliveryTime`: String
- `deliveryFee`: Number
- `tags`: Array of strings
- `menu`: Map of menu items
- `location`: GeoJSON Point
- `isActive`: Boolean

### Order Model
- `user`: Reference to User
- `restaurant`: Reference to Restaurant
- `items`: Array of order items
- `subtotal`: Number
- `deliveryFee`: Number
- `total`: Number
- `status`: String (enum)
- `deliveryAddress`: Object
- `paymentMethod`: String
- `createdAt`: Date

## 🔐 API Endpoints

### Authentication
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login a user

### User Management
- `GET /api/users/me`: Get current user profile
- `PUT /api/users/me`: Update user profile
- `POST /api/users/addresses`: Add a new address
- `DELETE /api/users/addresses/:addressId`: Delete an address
- `POST /api/users/favorites`: Toggle restaurant favorite

### Restaurants
- `GET /api/restaurants`: Get all restaurants
- `GET /api/restaurants/popular`: Get popular restaurants
- `GET /api/restaurants/featured`: Get featured restaurants
- `GET /api/restaurants/cuisine/:cuisineType`: Get restaurants by cuisine
- `GET /api/restaurants/search/:term`: Search restaurants
- `GET /api/restaurants/near`: Find nearby restaurants
- `GET /api/restaurants/:id`: Get restaurant by ID

### Orders
- `GET /api/orders/user/:userId`: Get all orders for a user
- `GET /api/orders/:id`: Get order by ID
- `POST /api/orders`: Create a new order
- `PATCH /api/orders/:id/status`: Update order status
- `PATCH /api/orders/:id/cancel`: Cancel an order

## 🚀 Deployment

### Front-end
The front-end is deployed on GitHub Pages.

### Back-end
The back-end can be deployed on:
- Heroku
- AWS Elastic Beanstalk
- Digital Ocean
- Any other Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details 