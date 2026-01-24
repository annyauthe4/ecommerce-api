const Product = require('../models/Product');

exports.create = async (data) => {
  return Product.create(data);
};

exports.getAll = async () => {
  return Product.find();
};
