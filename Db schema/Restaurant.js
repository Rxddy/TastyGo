const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('\Account.js');

const restaurantSchema = new Schema({
...Account,
    restName: { 
    type: String, 
    required: true 
},
restBalance: Number,
restOrders: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Order' 
}],
restReviews: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Review' 
}],
restOrderHistory: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Order' 
}],
menu: { 
    type: Schema.Types.ObjectId, 
    ref: 'Menu' 
}
});

module.exports = mongoose.model('Restaurant', restaurantSchema);