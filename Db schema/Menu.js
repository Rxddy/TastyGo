const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  MenuItems: [{
    type: Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]

});

module.exports = mongoose.model('Menu', menuSchema); 