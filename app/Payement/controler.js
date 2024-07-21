const Payment = require('./model');

const createPayment = async (req, res, next) => {
    try {
        let payload = req.body;
        let payment = new Payment(payload);
        await payment.save();
        return res.json(payment);
    } catch (err) {
        next(err);
    }
};

const getPayment = async (req, res, next) => {
    try {
        
        const payments = await Payment.find({},'Name');
        return res.json(payments);
    } catch (err) {
        next(err); 
    }
};

module.exports = {
    createPayment,
    getPayment  
};
