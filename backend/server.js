const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom-cart', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('MongoDB connected successfully');
    
    // Initialize products after successful connection
    await initializeProducts();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Running without MongoDB - using in-memory storage for demo');
    // Don't exit, continue without MongoDB for demo purposes
  }
};

// Function to initialize products in MongoDB
const initializeProducts = async () => {
  try {
    const Product = require('./models/Product');
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      const mockProducts = [
        {
          name: 'Wireless Bluetooth Headphones',
          price: 79.99,
          description: 'High-quality wireless headphones with noise cancellation',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Electronics',
          rating: 4.5,
          inStock: true,
        },
        {
          name: 'Smart Fitness Watch',
          price: 199.99,
          description: 'Track your fitness goals with this advanced smartwatch',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Electronics',
          rating: 4.3,
          inStock: true,
        },
        {
          name: 'Premium Coffee Beans',
          price: 24.99,
          description: 'Freshly roasted premium arabica coffee beans',
          image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Food & Beverage',
          rating: 4.8,
          inStock: true,
        },
        {
          name: 'Organic Cotton T-Shirt',
          price: 29.99,
          description: 'Comfortable and sustainable organic cotton t-shirt',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Clothing',
          rating: 4.2,
          inStock: true,
        },
        {
          name: 'Wireless Phone Charger',
          price: 39.99,
          description: 'Fast wireless charging pad for smartphones',
          image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Electronics',
          rating: 4.4,
          inStock: true,
        },
        {
          name: 'Yoga Mat',
          price: 49.99,
          description: 'Non-slip eco-friendly yoga mat for your practice',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Sports & Fitness',
          rating: 4.6,
          inStock: true,
        },
        {
          name: 'Stainless Steel Water Bottle',
          price: 34.99,
          description: 'Insulated water bottle that keeps drinks cold for 24 hours',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Lifestyle',
          rating: 4.7,
          inStock: true,
        },
        {
          name: 'LED Desk Lamp',
          price: 59.99,
          description: 'Adjustable LED desk lamp with multiple brightness levels',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop&auto=format&q=75',
          category: 'Home & Office',
          rating: 4.1,
          inStock: true,
        },
      ];
      
      await Product.insertMany(mockProducts);
      console.log('✅ Mock products initialized in MongoDB');
    } else {
      console.log('✅ Products already exist in MongoDB');
    }
  } catch (error) {
    console.error('❌ Error initializing products:', error.message);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/checkout', require('./routes/checkout'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce Cart API is running!' });
});

// Manual product initialization route (for development)
app.post('/api/init-products', async (req, res) => {
  try {
    await initializeProducts();
    res.json({ 
      success: true, 
      message: 'Products initialization attempted. Check server logs for details.' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initialize products',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;