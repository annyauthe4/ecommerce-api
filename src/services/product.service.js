const Product = require('../models/Product');

exports.createProduct = async (data) => {
  return Product.create(data);
};

exports.getAllProducts = async () => {
  return Product.find();
};

exports.getProductById = async (id) => {
  return Product.findById(id);
};

exports.updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    data,
    {new: true, runValidators: true}
  );

  if(!product) throw new Error('Product not found');
  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if(!product) throw new Error('Product not found');
  return product;
};
