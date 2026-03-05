const mongoose = require('mongoose');

/**
 * Main Order Mapper
 */
exports.orderToDTO = (order) => {
  return {
    id: order._id.toString(),
    user: mapUser(order.user),
    items: order.items.map(mapOrderItem),
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    isCancelable: order.status === 'pending'
  };
};

exports.ordersToDTO = (orders) => {
  return orders.map(exports.orderToDTO);
};

/**
 * Order Item Mapper
 */
const mapOrderItem = (item) => {
  return {
    product: mapProduct(item.product),
    quantity: item.quantity,
    price: item.price, // snapshot price at time of order
    subtotal: item.price * item.quantity
  };
};

/**
 * Product Mapper (Robust & Explicit)
 */
const mapProduct = (product) => {
  if (!product) return null;

  // If NOT populated → ObjectId
  if (mongoose.Types.ObjectId.isValid(product) && !product._id) {
    return product.toString();
  }

  // If populated document
  return {
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category
  };
};

/**
 * User Mapper
 */
const mapUser = (user) => {
  if (!user) return null;

  if (mongoose.Types.ObjectId.isValid(user) && !user._id) {
    return user.toString();
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  };
};