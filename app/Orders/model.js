const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliveryAddressSchema = new Schema({
  kecamatan: String,
  kelurahan: String,
  kabupaten: String,
  alamat: String
});

const OrderItemSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number
});

const OrderSchema = new Schema({
  orderItems: [OrderItemSchema],
  deliveryAddress: DeliveryAddressSchema,
  deliveryFee: {
    type: Number,
    default: 50000
  },
  totalProductPrice: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  payment: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Order', OrderSchema);
