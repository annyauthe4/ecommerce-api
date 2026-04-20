const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/email');
const { orderToDTO, ordersToDTO } = require('../dtos/order.dto');
const User = require('../models/User');

exports.createOrderFromCart = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'title price images stock')
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product || !item.product._id) {
        throw new Error('Product data is missing from cart');
      }
      const result = await Product.findOneAndUpdate(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity }
        },
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );

      if (!result) {
        throw new Error(`Only ${item.product.stock} left for ${item.product.title}`);
      }

      const unitPrice = Number(item.product.price);
      const lineTotal = unitPrice * item.quantity;

      totalAmount += lineTotal;

      orderItems.push({
        product: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        price: unitPrice
      });
    }

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          status: 'pending'
        }
      ],
      { session }
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    const user = await User.findById(userId).select('email name').lean();

    sendEmail({
      email: user.email,
      subject: `Order Confirmed! Order #${order._id}`,
      message: `Hi ${user.name}! Your oder for $${totalAmount} has been placed successfully.`
    }).catch(emailErr => console.error('Email failed to send', emailErr));

    return orderToDTO(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// exports.getUserOrders = async (userId, userRole) => {
//   const query = userRole === 'admin' ? {} : { user: userId };

//   const orders = await Order.find(query)
//     .populate({
//       path: 'user',
//       select: 'name email'
//     })
//     .populate({
//       path: 'items.product',
//       select: 'images'
//     })
//     .sort({ createdAt: -1 })
//     .lean();

//   return ordersToDTO(orders);
// };

exports.getOrderById = async (userId, orderId, userRole) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID format');
  }

  const order = await Order.findById(orderId)
    .populate('items.product', 'title price images')
    .populate('user', 'name email');

  if (!order) {
    throw new Error('Order not found');
  }

  if (userRole !== 'admin' && order.user._id.toString() !== userId.toString()) {
    throw new Error('Unauthorized: You do not own this order');
  }

  return orderToDTO(order);
}

exports.getOrders = async (filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate('items.product', 'title price')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments();
  
  return {
    orders: ordersToDTO(orders),
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

exports.cancelOrder = async (userId, orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).session(session);

    if (!order) {
      throw new Error('Order not found');
    }

    if (!['pending', 'paid'].includes(order.status)) {
      throw new Error('Order cannot be cancelled');
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    order.status = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return orderToDTO(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};