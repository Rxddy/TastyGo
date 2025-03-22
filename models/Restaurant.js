const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define menu item schema
const menuItemSchema = new Schema({
  id: String,
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: String,
  options: [{
    name: String,
    required: Boolean,
    choices: [{
      name: String,
      price: Number
    }]
  }]
});

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: {
    type: String,
    required: true
  },
  price: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  deliveryTime: {
    type: String,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  minOrder: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  promoCode: String,
  discount: String,
  menu: {
    mainItems: [menuItemSchema]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create a geospatial index for location-based queries
restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema); 