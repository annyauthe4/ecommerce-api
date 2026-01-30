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

  if(!product) return res.status(404).json({message: 'Product not found'});
  res.json(product);
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await ProductService.updateProduct(
      req.params.id,
      req.body
    );
    res.json(product);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.json({message: 'Product deleted successfully'});
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};