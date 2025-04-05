const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
    MenuItemName: { 
        type: String, 
        required: true 
    },
    MenuItemPrice: { 
        type: Number, 
        required: true 
    },
    MenuItemImage: {
        type: String,
        required: true
    },
    MenuItemDesc: {
        type: String,
        required: true
    }
  });
  
  module.exports = mongoose.model('MenuItem', MenuItemSchema);