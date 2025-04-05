const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    ItemPrice: { 
        type: Number, 
        required: true 
    },
    ItemCustomize: String,
    ItemMenuItem: { 
        type: Number,
        required: true
    },
  });
  
  module.exports = mongoose.model('Item', itemSchema);