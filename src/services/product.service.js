const Product = require('../models/Product');
const { deleteFile } = require('../utils/file');
const { productToDTO, productsToDTO } = require('../dtos/product.dto');

const mapImagePaths = (files = []) => {
  return files.map((file) => `/uploads/products/${file.filename}`);
};

exports.createProduct = async (data, files) => {
  const images = mapImagePaths(files);

  const productData = {
    ...data,
    price: Number(data.price),
    stock: Number(data.stock),
    images: images
  };

  const product = await Product.create(productData);
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

exports.updateProduct = async (id, data, files) => {
  const product = await Product.findById(id,);
  if(!product) throw new Error('Product not found');

  if (files && files.length > 0) {
    if (product.images && product.images.length > 0) {
      product.images.forEach((imagePath) => deleteFile(imagePath));
    }
    data.images = mapImagePaths(files);
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
