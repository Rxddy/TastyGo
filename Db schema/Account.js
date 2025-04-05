const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
username: {
    type: String,
    unique: true,
    required: true
},
password: {
    type: String,
    required: true
},
AccDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Account', accountSchema); 