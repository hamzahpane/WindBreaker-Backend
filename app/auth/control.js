const User = require('../User/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../util/index'); // Perbaiki cara mengimpor getToken


const register = async (req, res, next) => {
    try {
        
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.message
                
            });
        }
        next(error);
    }
};

// Middleware
const localStrategy = async (email, password, done) => {
    try {
        let user = await User
            .findOne({ email })
            .select('-__v -createdAt -updatedAt -token');
        if (!user) return done();
        if (bcrypt.compareSync(password, user.password)) {
            let { password, ...userWithoutPassword } = user.toJSON();
            return done(null, userWithoutPassword);
        }
    } catch (error) {
        done(error, null);
    }
    done();
};

// Login Method
const login = async (req, res, next) => {
    passport.authenticate('local', async (err, user) => {
        try {
            if (err) throw err; // Tangkap dan lemparkan kesalahan
            if (!user) return res.json({ err: 1, message: 'Email or Password incorrect' });
            let signed = jwt.sign(user, config.secretKey);
            await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
            res.json({
                message: 'Login Success',
                user,
                token: signed
            });
        } catch (error) {
            next(error); // Panggil fungsi next dengan kesalahan yang terjadi
        }
    })(req, res, next);
};

// metode logout 
const logout = async (req, res, next) => { // Ubah fungsi logout menjadi async
    try {
        let token = getToken(req);
        let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false });
        if (!token || !user) {
            return res.json({
                error: 1,
                message: 'No User Found'
            });
        }

        return res.json({
            error: 0,
            message: 'Logout berhasil'
        });
    } catch (error) {
        next(error);
    }
};

// cek token
const me = (req, res, next) => {
    if (!req.user) {
        return res.json({
            err: 1,
            message: 'You are not logged in or token expired'
        });
    }

    res.json(req.user);
};

module.exports = { register, localStrategy, login, logout, me };
