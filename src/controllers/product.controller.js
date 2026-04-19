const { search } = require('../routes/order.routes');
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
    let { page, limit, category, search } = req.query;

    if (search) {
      search = search.replace(/^["']|["']$/g, '');
    }
    const products = await ProductService.getAllProducts(
      parseInt(page) || 1,
      parseInt(limit) || 10,
      category,
      search
    );
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    if (err.message === 'Product not found') {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes('format')) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

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
