const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.createOrderFromCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  let totalAmount = 0;

  const orderItems = cart.items.map(item => {
    const unitPrice = Number(item.product.price);
    const lineTotal = unitPrice * item.quantity;
    totalAmount += lineTotal;

    return {
      product: item.product._id,
      quantity: item.quantity,
      price: unitPrice,
      subtotal: lineTotal
    };
  });

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount
  });

  // Clear cart after order creation
  cart.items = [];
  await cart.save();

  return order;
};

exports.getUserOrders = async (userId) => {
  return Order.find({ user: userId })
    .populate('items.product')
    .sort({ createdAt: -1 });
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

    // Restock products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    // Update order status
    order.status = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
