exports.cartToDTO = (cart) => {
  let totalPrice = 0;

  const items = cart.items.map(item => {
    const price = item.product?.price || 0;
    const subtotal = price * item.quantity;

    totalPrice += subtotal;

    return {
      product: mapProduct(item.product),
      quantity: item.quantity,
      subtotal
    };
  });

  return {
    id: cart._id.toString(),
    user: cart.user.toString(),
    items,
    totalPrice,
    createdAt: cart.createdAt
  };
};