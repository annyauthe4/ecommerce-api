const ProductService = require('../services/product.service');

exports.createProduct = async (req, res) => {
  const product = await ProductService.createProduct(req.body);
  res.status(201).json(product);
};

exports.getProducts = async (req, res) => {
  const products = await ProductService.getAllProducts();
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  res.json(product);
};
