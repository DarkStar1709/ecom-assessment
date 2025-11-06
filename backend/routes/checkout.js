const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const router = express.Router();

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp.slice(-6)}${random}`;
};

// POST /api/checkout - Process checkout and generate receipt
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, cartItems } = req.body;

    // Validation
    if (!customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and email are required',
      });
    }

    if (!customerEmail.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Get cart data
    let cart;
    if (cartItems && cartItems.length > 0) {
      // Use provided cart items
      cart = { items: cartItems };
    } else {
      // Get cart from database
      cart = await Cart.findOne({ userId: 'guest' }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty',
        });
      }
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      const price = item.productId ? item.productId.price : item.price;
      return sum + (price * item.quantity);
    }, 0);

    // Create order
    const orderNumber = generateOrderNumber();
    const orderItems = cart.items.map(item => ({
      productId: item.productId ? item.productId._id : item.productId,
      name: item.productId ? item.productId.name : item.name || 'Unknown Product',
      price: item.productId ? item.productId.price : item.price,
      quantity: item.quantity,
    }));

    const order = new Order({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      items: orderItems,
      total: parseFloat(total.toFixed(2)),
      orderNumber,
      status: 'confirmed',
    });

    await order.save();

    // Clear the cart after successful checkout
    if (!cartItems) {
      await Cart.findOneAndUpdate(
        { userId: 'guest' },
        { items: [], total: 0 }
      );
    }

    // Generate receipt
    const receipt = {
      orderNumber,
      customerName,
      customerEmail,
      items: orderItems,
      subtotal: total,
      tax: total * 0.08, // 8% tax
      total: total * 1.08,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString(), // 7 days from now
    };

    res.status(201).json({
      success: true,
      message: 'Checkout completed successfully',
      data: {
        order,
        receipt,
      },
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process checkout',
      error: error.message,
    });
  }
});

// GET /api/checkout/orders - Get all orders (for admin purposes)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
});

// GET /api/checkout/orders/:orderNumber - Get specific order
router.get('/orders/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
});

module.exports = router;