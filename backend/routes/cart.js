const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const store = require('../store');
const router = express.Router();

// Check if MongoDB is available
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Helper function to calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// GET /api/cart - Get cart items and total
router.get('/', async (req, res) => {
  try {
    let cart;
    
    if (isMongoConnected()) {
      cart = await Cart.findOne({ userId: 'guest' }).populate('items.productId');
      
      if (!cart) {
        cart = new Cart({ userId: 'guest', items: [], total: 0 });
        await cart.save();
      }

      // Calculate total
      cart.total = calculateCartTotal(cart.items);
      await cart.save();
    } else {
      cart = store.getCart();
    }

    res.json({
      success: true,
      data: cart,
      itemCount: cart.items.length,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message,
    });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    let cart;
    
    if (isMongoConnected()) {
      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      cart = await Cart.findOne({ userId: 'guest' });
      
      if (!cart) {
        cart = new Cart({ userId: 'guest', items: [] });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += parseInt(quantity);
      } else {
        // Add new item to cart
        cart.items.push({
          productId,
          quantity: parseInt(quantity),
          price: product.price,
        });
      }

      // Calculate total
      cart.total = calculateCartTotal(cart.items);
      await cart.save();

      // Populate product details for response
      await cart.populate('items.productId');
    } else {
      cart = store.addToCart(productId, parseInt(quantity));
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message,
    });
  }
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required',
      });
    }

    const cart = await Cart.findOne({ userId: 'guest' });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items[itemIndex].quantity = parseInt(quantity);
    cart.total = calculateCartTotal(cart.items);
    await cart.save();

    await cart.populate('items.productId');

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message,
    });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;

    const cart = await Cart.findOne({ userId: 'guest' });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.total = calculateCartTotal(cart.items);
    await cart.save();

    await cart.populate('items.productId');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message,
    });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: 'guest' });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message,
    });
  }
});

module.exports = router;