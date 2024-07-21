const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = Schema({
    name: String,
    price: Number,
    quantity: Number
});

const orderSchema = Schema({
    orderItems: [orderItemSchema],
    totalAmount: {
        type: Number,
        default: 0
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
