const Order = require('./model');
const OrderItem = require('../Orderitem/model');

const createOrder = async (req, res, next) => {
  try {
    const { orderItems, ...rest } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: 'OrderItems are required' });
    }

    const orderItemIds = [];

    for (const item of orderItems) {
      let orderItem = new OrderItem(item);
      const savedItem = await orderItem.save();
      orderItemIds.push(savedItem._id); 
    }

    const newOrder = new Order({
      ...rest,
      orderItems: orderItemIds, 
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json(savedOrder);
  } catch (error) {
    next(error); 
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    
    const transformedOrders = orders.map(order => ({
      _id: order._id, // Menggunakan _id langsung, karena sudah diubah di model Order
      orderItems: order.orderItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        _id: item._id 
      })),
      totalAmount: order.totalAmount,
      orderDate: order.orderDate 
    }));
    
    res.status(200).json(transformedOrders);
  } catch (error) {
    next(error); 
  }
};


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
