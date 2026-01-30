const CartService = require('../services/cart.service');

exports.getCart = async (req, res) => {
  const cart = await CartService.getUserCart(req.user.id);
  res.json(cart || { items: [] });
};

exports.addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartService.addToCart(
      req.user.id,
      productId,
      quantity
    );
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const cart = await CartService.updateCartItem(
      req.user.id,
      req.params.productId,
      req.body.quantity
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const cart = await CartService.removeCartItem(
      req.user.id,
      req.params.productId
    );
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  await CartService.clearCart(req.user.id);
  res.json({ message: 'Cart cleared' });
};
