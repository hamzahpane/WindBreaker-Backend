const Product = require('../Products/model');
const CartItem = require('../CartItem/model');

const updateCartItem = async (req, res, next) => {
    try {
        const { items } = req.body;
        const productsId =   items.map(item => item.product._id);
        const products = await Product.find({ _id: { $in: productsId } });
        
        let cartItems = items.map(item => {
            let relatedProduct = products.find(product => product._id.toString() === item.product._id);
            return {
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,  
                name: relatedProduct.name,
                user: req.user._id,
                qty: item.qty
            };
        });
        console.log(items);
        await CartItem.deleteMany({ user: req.user._id });
        await CartItem.bulkWrite(cartItems.map(item => ({
            updateOne: {
                filter: {
                    user: req.user._id,
                    product: item.product
                },
                update: item,
                upsert: true
            }
        })));
        
        return res.json(cartItems);
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
};

const getCartItem = async (req, res, next) => {
    try {
        let items = await CartItem.find({ user: req.user._id }).populate('product');
        return res.json(items);
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
};

module.exports = { getCartItem, updateCartItem };
