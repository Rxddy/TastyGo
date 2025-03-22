const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    itemId: String,
    name: String,
    price: Number,
    quantity: Number,
    options: [{
      name: String,
      choice: String,
      price: Number
    }]
  }],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentMethod: {
    type: String,
    required: true
  },
  specialInstructions: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  estimatedDeliveryTime: String,
  promoCodeApplied: {
    code: String,
    discount: Number
  }
});

module.exports = mongoose.model('Order', orderSchema); 