const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('\Account.js');

const customerSchema = new Schema({
    ...Account,
    cusFullName: { 
        type: String, 
        required: true 
    },
    cusPayment: [{
        cardnum: String,
        expdate: String,
        cvc: String
    }],
    cusOrderHistory: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Order' 
    }],
    cusOrders: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Order' 
    }],
    cusReviews: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Review' 
    }]
  });
  
  module.exports = mongoose.model('Customer', customerSchema);