const Restaurant = require('../models/Restaurant');

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Find restaurants by cuisine
exports.getRestaurantsByCuisine = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ cuisine: req.params.cuisineType });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search restaurants by name, cuisine, or tags
exports.searchRestaurants = async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const restaurants = await Restaurant.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { cuisine: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Find restaurants near a location
exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters, default 5km
    
    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get popular restaurants (by rating)
exports.getPopularRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .sort({ rating: -1 })
      .limit(10);
    
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get featured restaurants
exports.getFeaturedRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ featured: true });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 