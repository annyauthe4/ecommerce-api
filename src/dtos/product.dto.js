exports.productToDTO = (product) => {
  return {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
    images: product.images || [],
    category: product.category,
    createdAt: product.createdAt
  };
};

exports.productsToDTO = (products) => {
  return products.map(exports.productToDTO);
}