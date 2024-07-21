const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderItemSchema = new Schema({
    name: String,
    price: Number,
    quantity: Number
});

const orderSchema = new Schema({
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

const invoiceSchema = new Schema({
    order: {
        type: orderSchema,
        required: true
    },
    payment: {
        type: String,  // Tipe data harus sesuai dengan tipe data di model Payment
        required: true
    }
}, { timestamps: true });

const Invoice = model('Invoice', invoiceSchema);

module.exports = Invoice;
