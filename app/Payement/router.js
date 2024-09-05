const router = require('express').Router();
const Payment = require('./controler');

router.get('/getpay' ,Payment.getPayment);
router.post('/postpay' , Payment.createPayment);



module.exports = router;


// const OrderItem = require('./model');
// const Order = require('../Orders/model');
// const Payment = require('../Payement/model');
// // const createItem = async (req, res, next) => {
//     try {
//         const payload = req.body.products;
//         const {payment_id } = req.body;
//         const { deliveryAddress: deliveryAddressData } = req.body; 
//         const savedItems = [];
//         let totalAmount = 0; 

//         // Buat item order
//         for (const item of payload) {
//             const { Nama, Harga, quantity } = item;

//             const subtotal = Harga * quantity; 
//             totalAmount += subtotal; 

//             const orderItem = new OrderItem({
//                 name: Nama,
//                 price: Harga,
//                 quantity: quantity,
//             });

//             const savedItem = await orderItem.save();
//             savedItems.push(savedItem);
//         }

//         // Buat order dengan alamat pengiriman sebagai objek
//         const order = new Order({
//             orderItems: savedItems.map(item => ({
//                 _id: item._id,
//                 name: item.name,
//                 price: item.price,
//                 quantity: item.quantity,
//             })),
//             deliveryAddress: deliveryAddressData, // Simpan alamat pengiriman sebagai objek
//             totalAmount: totalAmount,
//             orderDate: new Date(),
//         });

//         const savedOrder = await order.save();
//         res.status(201).json({ message: 'Order and delivery address created successfully', savedOrder });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = { createItem };