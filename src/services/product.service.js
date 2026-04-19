const Product = require('../models/Product');
const { deleteFile } = require('../utils/file');
const { productToDTO, productsToDTO } = require('../dtos/product.dto');
const { default: mongoose } = require('mongoose');

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

exports.getAllProducts = async (page = 1, limit = 10, category, search) => {
  const skip = (page - 1) * limit;

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$text = { $search: search, $options: 'i' };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select('title price category images stock')
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);
  return {
    products: productsToDTO(products),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

exports.getProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product ID');
  }
  const product = await Product.findById(id).lean();
  if (!product) {
    throw new Error('Product not found');
  }

  // Fetch related products excluding current ID
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: id }
  })
    .limit(4)
    .select('title price images category')
    .lean();
  
  return {
    product: productToDTO(product),
    relatedProducts: relatedProducts.map(p => productToDTO(p))
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
