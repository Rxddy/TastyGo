const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: String,
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  phoneNumber: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }]
});

module.exports = mongoose.model('User', userSchema); 