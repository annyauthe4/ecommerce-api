const orderService = require('../services/order.service');

exports.placeOrder = async (req, res) => {
  try {
    const order = await orderService.createOrderFromCart(req.user.id);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {user: req.user.id};
    const orders = await orderService.getOrders(filter, page, limit);

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.user.id,
      req.params.orderId,
      req.user.role
    );
    res.json(order);
  } catch (err) {
    // If the error message includes "not found" or "Invalid", handle accordingly
    if (err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes('Unauthorized')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    filter = {}
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await orderService.getOrders(filter, page, limit);
    
    // Result should ideally contain { orders, totalPages, currentPage }
    res.status(200).json(orders);
  } catch (err) {
    next(err);
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