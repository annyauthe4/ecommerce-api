const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { orderToDTO, ordersToDTO } = require('../dtos/order.dto');

exports.createOrderFromCart = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product')
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        throw new Error('Product not found');
      }

      if (item.quantity > item.product.stock) {
        throw new Error(
          `Only ${item.product.stock} item(s) available for ${item.product.title}`
        );
      }

      const unitPrice = Number(item.product.price);
      const lineTotal = unitPrice * item.quantity;

      totalAmount += lineTotal;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: unitPrice
      });

      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    const order = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount
        }
      ],
      { session }
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return orderToDTO(order[0]);
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