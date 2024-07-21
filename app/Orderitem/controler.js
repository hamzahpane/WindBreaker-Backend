const OrderItem = require('./model');
const Order = require('../Orders/model');

const createItem = async (req, res, next) => {
    try {
        const payload = req.body.products;
        const savedItems = [];

        let totalAmount = 0; 

        for (const item of payload) {
            const { Nama, Harga, quantity } = item;

            const subtotal = Harga * quantity; 
            totalAmount += subtotal; 

            const orderItem = new OrderItem({
                name: Nama,
                price: Harga,
                quantity: quantity,
            });

            const savedItem = await orderItem.save();
            savedItems.push(savedItem);
        }

        const order = new Order({
            orderItems: savedItems.map(item => ({
                _id: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            totalAmount: totalAmount,
            orderDate: new Date(), // Menambahkan orderDate saat order dibuat
        });


        console.log(order);

        const savedOrder = await order.save();
        res.status(201).json({ message: 'Order items created and order saved successfully', savedOrder });
    } catch (error) {
        next(error);
    }
};

module.exports = { createItem };
