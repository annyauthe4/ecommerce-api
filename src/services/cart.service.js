const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { cartToDTO } = require('../dtos/cart.dto');

const populateCart = (cartId) => {
  return Cart.findById(cartId).populate({
    path: 'items.product',
    select: 'title price images'
  });
};

exports.getUserCart = async (userId) => {
  return Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title price images stock'
  });
};

exports.addToCart = async (userId, productId, quantity = 1) => {
  if (quantity < 1) throw new Error('Quantity must be at least one');

  const [product, cart] = await Promise.all([
    Product.findById(productId).select('stock price title').lean(),
    Cart.findOne({ user: userId })
  ]);

  // const product = await Product.findById(productId).select('stock').lean();
  if (!product) throw new Error('Product not found');
  // if (product.stock < quantity) throw new Error('Insufficient stock');

  // 2. Logic for New Cart
  if (!cart) {
    if (quantity > product.stock) throw new Error(`Only ${product.stock} in stock`);

    const newCart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }]
    });

    const populated = await newCart.populate('items.product', 'title price images');
    return { cart: cartToDTO(populated) };
  }

  // 3. Logic for Existing Cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    const newQuantity = cart.items[itemIndex].quantity + quantity;
    if (newQuantity > product.stock) throw new Error(`Only ${product.stock} in stock`);
    cart.items[itemIndex].quantity = newQuantity;
  } else {
    if (quantity > product.stock) throw new Error(`Only ${product.stock} in stock`);
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  
  await cart.populate({
    path: 'items.product',
    select: 'title price images stock'
  });
  
  return {
    cart: cartToDTO(cart)
  };
};

exports.updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) {
    throw new Error('Quantity must be at least one');
  }

  const [product, cart] = await Promise.all([
    Product.findById(productId).select('stock price title').lean(),
    Cart.findOne({ user: userId })
  ]);

  if (!cart) throw new Error('Cart not found');

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );
  if (!item) throw new Error('Item not in cart');

  if (!product) {
    throw new Error('Product not found');
  }

  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} item(s) available in stock`);
  }

  item.quantity = quantity;
  await cart.save();

  await cart.populate({
    path: 'items.product',
    select: 'title price images stock'
  });
  return {
    cart: cartToDTO(cart)
  };
};

exports.removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();

  await cart.populate({
    path: 'items.product',
    select: 'title price images stock'
  });
  return {
    cart: cartToDTO(cart)
  };
};
exports.clearCart = async (userId) => {
  await Cart.findOneAndDelete({ user: userId });
};