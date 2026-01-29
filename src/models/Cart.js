const mongoose = require('mongoose');
const Product = require('./Product');


const CartItemSchema = new mongoose.Schema(
  Product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    require: True
  },
  quantity: {
    type: Number,
    required true:,
    min: 1 
  },
  {_id: false}
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);