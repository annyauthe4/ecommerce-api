const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getUserCart = async (userId) => {
  return Cart.findOne({ user: userId }).populate('items.product');
};

exports.addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }]
    });
    return cart;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return cart;
};

exports.updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );
  if (!item) throw new Error('Item not in cart');

  item.quantity = quantity;
  await cart.save();
  return cart;
};

exports.removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();
  return cart;
};

exports.clearCart = async (userId) => {
  await Cart.findOneAndDelete({ user: userId });
};
