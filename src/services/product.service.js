const Product = require('../models/Product');
const { deleteFile } = require('../utils/file');
const { productToDTO, productsToDTO } = require('../dtos/product.dto');

exports.createProduct = async (data, file) => {
  const image = file
    ? `/uploads/products/${file.filename}`
    : null;
  const product = await Product.create(data, image);
  return {
    product: productToDTO(product)
  };
};

exports.getAllProducts = async () => {
  const products = await Product.find();
  return {
    products: productsToDTO(products)
  };
};

exports.getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return {
    product: productToDTO(product)
  };
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

  return {
    product: productToDTO(product)
  };
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if(!product) throw new Error('Product not found');
  if (product.image) {
    deleteFile(product.image);
  }
  return {
    product: productToDTO(product)
  };
};
