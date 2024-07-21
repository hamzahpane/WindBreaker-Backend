const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, 'Panjang nama makanan minimal 5 karakter'],
        required: [true, 'Nama harus diisi'],
    },
    price: {
        type: Number,
        required: [true, 'Harga harus diisi'],
    },
    quantity: {
        type: Number,
        required: [true, 'Kuantitas harus diisi'],
        min: [1, 'Kuantitas minimal 1'],
    },
});

module.exports = model('OrderItem', orderItemSchema);
