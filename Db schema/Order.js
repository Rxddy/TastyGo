const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    ordItems: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Item' 
    }],
    OrdRestaurantNum: {
        type: Number,
        required: true
    },
    OrdCusNum: {
        type: Number,
        required: true
    },
    OrdStatus: {
        type: String,
        enum: ['cancelled','pending', 'accepted', 'preparing', 'ready', 'delivering', 'completed', ],
        default: 'pending'
    },
    OrdDetails: String
  });
  
  module.exports = mongoose.model('Customer', orderSchema);