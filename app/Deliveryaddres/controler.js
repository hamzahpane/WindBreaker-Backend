const DeliveryAddress = require('./model');

const createDeliveryaddres = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = req.user;
        let address = new DeliveryAddress({ ...payload, user: user._id });
        await address.save();
        return res.json(address);
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}

const updateDeliveryaddres = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = req.user;
        let address = await DeliveryAddress.findByIdAndUpdate(req.params.id, { ...payload, user: user._id }, {
            new: true,
            runValidators: true
        });
        return res.json(address);
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}

const getDeliveryaddres = async (req, res, next) => {
    try {
        let address = await DeliveryAddress.find({}, 'name kelurahan kecamatan kabupaten detail');
        return res.json(address);
    } catch (error) {
        next(error);
    }
}

const destroyDeliveryaddres = async (req, res, next) => {
    try {
        let address = await DeliveryAddress.findByIdAndDelete(req.params.id);
        return res.json(address);
    } catch (err) {
        next(err);
    }
};
module.exports = {
    createDeliveryaddres,
    updateDeliveryaddres, // Menambahkan fungsi updateDeliveryaddres ke daftar ekspor
    getDeliveryaddres ,
    destroyDeliveryaddres
}
