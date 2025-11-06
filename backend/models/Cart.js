const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'guest',
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;