const Product = require('../models/Product');
const { deleteFile } = require('../utils/file');

exports.createProduct = async (data, file) => {
  const image = file
    ? `/uploads/products/${file.filename}`
    : null;
  return Product.create(data, image);
};

exports.getAllProducts = async () => {
  return Product.find();
};

exports.getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

exports.updateProduct = async (id, data, file) => {
  const product = await Product.findById(id,);
  if(!product) throw new Error('Product not found');

  if (file && product.image) {
    deleteFile(product.image);
    data.image = `/uploads/products/${file.filename}`;
  }

  Object.assign(product, data);
  await product.save();

  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if(!product) throw new Error('Product not found');
  if (product.image) {
    deleteFile(product.image);
  }
  return product;
};
