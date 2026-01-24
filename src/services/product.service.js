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
