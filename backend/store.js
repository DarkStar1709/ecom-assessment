// Simple in-memory data store for demo purposes when MongoDB is not available
class InMemoryStore {
  constructor() {
    this.products = [];
    this.cart = { _id: 'cart-1', userId: 'guest', items: [], total: 0 };
    this.orders = [];
    this.initialized = false;
  }

  // Initialize with mock products
  initializeProducts() {
    if (this.initialized) return;
    
    this.products = [
      {
        _id: 'prod-1',
        name: 'Wireless Bluetooth Headphones',
        price: 79.99,
        description: 'High-quality wireless headphones with noise cancellation',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop&auto=format&q=75',
        category: 'Electronics',
        rating: 4.5,
        inStock: true,
      },
      {
        _id: 'prod-2',
        name: 'Smart Fitness Watch',
        price: 199.99,
        description: 'Track your fitness goals with this advanced smartwatch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop&auto=format&q=75',
        category: 'Electronics',
        rating: 4.3,
        inStock: true,
      },
      {
        _id: 'prod-3',
        name: 'Premium Coffee Beans',
        price: 24.99,
        description: 'Freshly roasted premium arabica coffee beans',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200&h=150&fit=crop&auto=format&q=75',
        category: 'Food & Beverage',
        rating: 4.8,
        inStock: true,
      },
      {
        _id: 'prod-4',
        name: 'Organic Cotton T-Shirt',
        price: 29.99,
        description: 'Comfortable and sustainable organic cotton t-shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=150&fit=crop&auto=format&q=75',
        category: 'Clothing',
        rating: 4.2,
        inStock: true,
      },
      {
        _id: 'prod-5',
        name: 'Wireless Phone Charger',
        price: 39.99,
        description: 'Fast wireless charging pad for smartphones',
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=150&fit=crop&auto=format&q=75',
        category: 'Electronics',
        rating: 4.4,
        inStock: true,
      },
      {
        _id: 'prod-6',
        name: 'Yoga Mat',
        price: 49.99,
        description: 'Non-slip eco-friendly yoga mat for your practice',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop&auto=format&q=75',
        category: 'Sports & Fitness',
        rating: 4.6,
        inStock: true,
      },
      {
        _id: 'prod-7',
        name: 'Stainless Steel Water Bottle',
        price: 34.99,
        description: 'Insulated water bottle that keeps drinks cold for 24 hours',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=150&fit=crop&auto=format&q=75',
        category: 'Lifestyle',
        rating: 4.7,
        inStock: true,
      },
      {
        _id: 'prod-8',
        name: 'LED Desk Lamp',
        price: 59.99,
        description: 'Adjustable LED desk lamp with multiple brightness levels',
        image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSoAXQ2Ly9Uq2A1iH0sBv-Z469fvci-AFQJVBF6UScY4d1j_rKSFz8OGT0mE3e0k-vaWBt7mMkBGhEzVMZ3vjk71DspjiYJl-4P2bro8NudVS3kEd25wNeG1bg',
        category: 'Home & Office',
        rating: 4.1,
        inStock: true,
      },
    ];
    
    this.initialized = true;
    console.log('In-memory store initialized with mock products');
  }

  // Product methods
  getAllProducts() {
    this.initializeProducts();
    return this.products.filter(p => p.inStock);
  }

  getProductById(id) {
    this.initializeProducts();
    return this.products.find(p => p._id === id);
  }

  // Cart methods
  getCart() {
    return this.cart;
  }

  addToCart(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const existingItemIndex = this.cart.items.findIndex(
      item => item.productId._id === productId
    );

    if (existingItemIndex > -1) {
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      this.cart.items.push({
        _id: `item-${Date.now()}`,
        productId: product,
        quantity,
        price: product.price,
      });
    }

    this.calculateCartTotal();
    return this.cart;
  }

  updateCartItem(itemId, quantity) {
    const itemIndex = this.cart.items.findIndex(item => item._id === itemId);
    if (itemIndex === -1) throw new Error('Item not found');

    this.cart.items[itemIndex].quantity = quantity;
    this.calculateCartTotal();
    return this.cart;
  }

  removeFromCart(itemId) {
    this.cart.items = this.cart.items.filter(item => item._id !== itemId);
    this.calculateCartTotal();
    return this.cart;
  }

  clearCart() {
    this.cart.items = [];
    this.cart.total = 0;
    return this.cart;
  }

  calculateCartTotal() {
    this.cart.total = this.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
  }

  // Order methods
  createOrder(orderData) {
    const order = {
      _id: `order-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.push(order);
    return order;
  }

  getAllOrders() {
    return this.orders;
  }

  getOrderByNumber(orderNumber) {
    return this.orders.find(order => order.orderNumber === orderNumber);
  }
}

module.exports = new InMemoryStore();