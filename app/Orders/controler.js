
// Order.js
const Order = require('./model');
const Payment = require('../Payement/model');
const Invoice = require('../Invoce/model'); 

const createOrder = async (req, res, next) => {
    try {
        const { products, payment_id, deliveryAddress } = req.body;
        let totalProductPrice = 0;

        // Cari payment berdasarkan payment_id
        const payment = await Payment.findById(payment_id);
        if (!payment) {
            return res.status(404).json({
                error: 1,
                message: `Payment dengan ID ${payment_id} tidak ditemukan.`
            });
        }

        // Buat item order dan hitung total harga produk
        const orderItems = products.map(item => {
            const { name, price, quantity } = item;
            const subtotal = price * quantity;
            totalProductPrice += subtotal;
            return {
                name,
                price,
                quantity
            };
        });

        // Total amount adalah total harga produk ditambah ongkos kirim
        const totalAmount = totalProductPrice + 50000; // Delivery fee

        // Buat order baru
        const newOrder = new Order({
            orderItems,
            deliveryAddress,
            deliveryFee: 50000,
            totalProductPrice,
            totalAmount,
            payment: payment.Name // Menggunakan nama dari model Payment
        });

        // Simpan order ke database
        const savedOrder = await newOrder.save();

        // Buat dan simpan invoice setelah order berhasil disimpan
        const invoice = new Invoice({
            order: savedOrder
        });
        const savedInvoice = await invoice.save();
          console.log(savedInvoice);
        // Kirim response berhasil
        return res.status(201).json({
            order: savedOrder,
            invoice: savedInvoice
        });
    } catch (error) {
        next(error); // Tangani error
    }
};


const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('orderItems') // Populasi orderItems untuk mendapatkan detail item
      .populate('deliveryAddress'); // Populasi deliveryAddress untuk mendapatkan detail alamat

    const transformedOrders = orders.map(order => ({
      _id: order._id,
      orderItems: order.orderItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        _id: item._id
      })),
      deliveryAddress: {
        Kecamatan: order.deliveryAddress.kecamatan,
        Kelurahan: order.deliveryAddress.kelurahan,
        Kabupaten: order.deliveryAddress.kabupaten,
      },
      totalAmount: order.totalAmount,
      orderDate: order.orderDate
    }));

    res.status(200).json(transformedOrders);
  } catch (error) {
    next(error); // Lanjutkan error ke middleware error handler
  }
};

module.exports = { getOrders };


const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id; // Ambil ID dari params URL sebagai string

    // Temukan order yang sesuai dengan orderId
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Hapus juga orderItems yang terkait
    for (const itemId of deletedOrder.orderItems) {
      await OrderItem.findByIdAndDelete(itemId);
    }

    res.status(200).json({ message: 'Order and associated OrderItems deleted successfully' });
  } catch (error) {
    next(error);
  }
};


module.exports = { createOrder, getOrders, deleteOrder };
