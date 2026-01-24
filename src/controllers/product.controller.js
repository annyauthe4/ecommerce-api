const ProductService = require('../services/product.service');

exports.createProduct = async (req, res) => {
  const product = await ProductService.create(req.body);
  res.status(201).json(product);
};

exports.getProducts = async (req, res) => {
  const products = await ProductService.getAll();
  res.json(products);
};
