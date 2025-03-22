const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Get all restaurants
router.get('/', restaurantController.getAllRestaurants);

// Get popular restaurants
router.get('/popular', restaurantController.getPopularRestaurants);

// Get featured restaurants
router.get('/featured', restaurantController.getFeaturedRestaurants);

// Find restaurants by cuisine - must be before /:id to avoid conflicts
router.get('/cuisine/:cuisineType', restaurantController.getRestaurantsByCuisine);

// Search restaurants by name, cuisine, or tags
router.get('/search/:term', restaurantController.searchRestaurants);

// Find restaurants near a location
router.get('/near', restaurantController.getNearbyRestaurants);

// Get restaurant by ID - must be after all other routes with path parameters
router.get('/:id', restaurantController.getRestaurantById);

module.exports = router; 