const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        required: [true, 'Nama makanan harus diisi']
    },
    description: {
        type: String,
        maxlength: [1000, 'Panjang karakter deskripsi maksimal 1000 karakter']
    },
    price: {
        type: Number,
        default: 0
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
    ,

    tags: {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }
    ,
    image_url: String,



}, { timestamps: true });



module.exports = model('Product', ProductSchema);
