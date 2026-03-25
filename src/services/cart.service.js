const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { cartToDTO } = require('../dtos/cart.dto');

const populateCart = (cartId) => {
  return Cart.findById(cartId).populate({
    path: 'items.product',
    select: 'title price description category images stock createdAt'
  });
};

exports.getUserCart = async (userId) => {
  return Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title price description category images stock createdAt'
  });
};

exports.addToCart = async (userId, productId, quantity = 1) => {
  if (quantity < 1) {
    throw new Error('Quantity must be at least one');
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} item(s) available in stock`);
    }

    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }]
    });

    const populatedCart = await populateCart(cart._id);
    return {
      cart: cartToDTO(populatedCart)
    };
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    const newQuantity = cart.items[itemIndex].quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error(`Only ${product.stock} item(s) available in stock`);
    }
    cart.items[itemIndex].quantity = newQuantity;
  } else {
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} item(s) available in stock`);
    }
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  const populatedCart = await populateCart(cart._id);
  return {
    cart: cartToDTO(populatedCart)
  };
};

exports.updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) {
    throw new Error('Quantity must be at least one');
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );
  if (!item) throw new Error('Item not in cart');

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} item(s) available in stock`);
  }

  item.quantity = quantity;
  await cart.save();

  const populatedCart = await populateCart(cart._id);
  return {
    cart: cartToDTO(populatedCart)
  };
};

exports.removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();

  const populatedCart = await populateCart(cart._id);
  return {
    cart: cartToDTO(populatedCart)
  };
};

exports.clearCart = async (userId) => {
  await Cart.findOneAndDelete({ user: userId });
};