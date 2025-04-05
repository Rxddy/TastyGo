const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
restaurant: {
    type: Number,
    required: true
},
customer: {
    type: Number,
    required: true
},
rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
},
body: {
    type: String,
    default: ''
}
});

module.exports = mongoose.model('Review', reviewSchema); 