const express = require('express');
const Product = require('../models/Product');
const store = require('../store');
const router = express.Router();

// Mock products data
const mockProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    category: 'Electronics',
    rating: 4.5,
  },
  {
    name: 'Smart Fitness Watch',
    price: 199.99,
    description: 'Track your fitness goals with this advanced smartwatch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    category: 'Electronics',
    rating: 4.3,
  },
  {
    name: 'Premium Coffee Beans',
    price: 24.99,
    description: 'Freshly roasted premium arabica coffee beans',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300',
    category: 'Food & Beverage',
    rating: 4.8,
  },
  {
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    description: 'Comfortable and sustainable organic cotton t-shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    category: 'Clothing',
    rating: 4.2,
  },
  {
    name: 'Wireless Phone Charger',
    price: 39.99,
    description: 'Fast wireless charging pad for smartphones',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300',
    category: 'Electronics',
    rating: 4.4,
  },
  {
    name: 'Yoga Mat',
    price: 49.99,
    description: 'Non-slip eco-friendly yoga mat for your practice',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300',
    category: 'Sports & Fitness',
    rating: 4.6,
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 34.99,
    description: 'Insulated water bottle that keeps drinks cold for 24 hours',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300',
    category: 'Lifestyle',
    rating: 4.7,
  },
  {
    name: 'LED Desk Lamp',
    price: 59.99,
    description: 'Adjustable LED desk lamp with multiple brightness levels',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    category: 'Home & Office',
    rating: 4.1,
  },
];

// Check if MongoDB is available
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Initialize database with mock products
const initializeProducts = async () => {
  if (!isMongoConnected()) {
    console.log('Using in-memory store for products');
    return;
  }

  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(mockProducts);
      console.log('Mock products initialized in MongoDB');
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

// Call initialization
initializeProducts();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    let products;
    
    if (isMongoConnected()) {
      products = await Product.find({ inStock: true });
    } else {
      products = store.getAllProducts();
    }

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    let product;
    
    if (isMongoConnected()) {
      product = await Product.findById(req.params.id);
    } else {
      product = store.getProductById(req.params.id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
});

module.exports = router;