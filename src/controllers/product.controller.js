const ProductService = require('../services/product.service');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(
      req.body,
      req.files
    );
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};


exports.updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(
      req.params.id,
      req.body,
      req.files
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
};


exports.deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
