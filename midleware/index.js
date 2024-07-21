const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/User/model');
const { getToken, policyfor } = require("../util");

function decodeToken() {
    return async (req, res, next) => {
        try {
            let token = getToken(req);

            if (!token) return next();

            req.user = jwt.verify(token, config.secretKey); 
            let user = await User.findOne({ token: { $in: [token] } });

            if (!user) {
                return res.json({
                    err: 1,
                    message: 'Token expired'
                });
            }
        } catch (err) {
            if (err && err.name === 'JsonWebTokenError') {
                return res.json({
                    error: 1,
                    message: err.message
                });
            }
            return next(err);
        }
        next();
    };
}

// Middleware untuk cek hak akses:
function police_cek(action, subject) {
    return function(req, res, next) {
        let policy = policyfor(req.user);
        if (!policy.can(action, subject)) {
            return res.json({
                error: 1,
                message: `You are not allowed to ${action} ${subject}`
            });
        }
        next();
    };
} 

module.exports = { decodeToken, police_cek };
