const Category = require('./model');

const store = async (req, res, next) => {
    try {
        let payload = req.body;
        let category = new Category(payload);
        await category.save();
        return res.json(category);
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        let payload = req.body;
        let category = await Category.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });
        return res.json(category);
    } catch (err) {
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try {
        let category = await Category.findByIdAndDelete(req.params.id);
        return res.json(category);
    } catch (err) {
        next(err);
    }
};

const index = async (req, res, next) => {
    try {
        let categories = await Category.find({}, 'name');
        return res.json(categories);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    store,
    update,
    destroy,
    index
};
