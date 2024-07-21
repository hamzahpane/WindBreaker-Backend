const Tag = require('./model');

const Create = async (req, res, next) => {
    try {
        let payload = req.body;
        let tag = new Tag(payload);
        await tag.save();
        return res.json(tag);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        let payload = req.body;
        let tag = await Tag.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });
        return res.json(tag);
    } catch (err) {
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try {
        let tag = await Tag.findByIdAndDelete(req.params.id);
        return res.json(tag);
    } catch (err) {
        next(err);
    }
};

const index = async (req, res, next) => {
    try {
        let tags = await Tag.find({}, 'name');
        return res.json(tags);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    Create,
    update,
    destroy,
    index
};
