const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoInc = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

let userSchema = Schema({
    username: {
        type: String,
        required: [true, 'Nama harus diisi'],
        maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
        minlength: [3, 'Panjang nama harus minimal 3']
    },
    customer_id: {
        type: Number
    },
    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        minlength: [10, 'Panjang email minimal harus diisi 10 karakter'],
        maxlength: [255, 'Panjang email maksimal adalah 255 karakter'],
        validate: {
            validator: function(value) {
                if (!value) return false; // Menambahkan validasi untuk memeriksa apakah email tidak kosong
                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                return emailRegex.test(value);
            },
            message: attr => `${attr.value} harus merupakan email valid`
        }
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        minlength: [10, 'Panjang password minimal harus diisi 10 karakter'],
        maxlength: [255, 'Panjang password maksimal adalah 255 karakter']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: [String]
}, { timestamps: true });

userSchema.path('email').validate(async function(value) {
    try {
        if (!value) return false; // Menambahkan validasi untuk memeriksa apakah email tidak kosong
        const count = await this.model('User').countDocuments({ email: value });
        return count === 0;
    } catch (error) {
        throw error;
    }
}, attr => `${attr.value} sudah terdaftar`);

const Has_round = 10;
userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, Has_round);
    next();
});

userSchema.plugin(AutoInc, { inc_field: 'customer_id' });

module.exports = model('User', userSchema);
