const orderService = require('../services/order.service');

exports.placeOrder = async (req, res) => {
  try {
    const order = await orderService.createOrderFromCart(req.user.id);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(
      req.user.id,
      req.params.orderId
    );

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};