import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data.data || [];
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    if (!response.data.data) {
      throw new Error('Product not found');
    }
    return response.data.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.data || { _id: '', userId: 'guest', items: [], total: 0 };
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart', {
      productId,
      quantity,
    });
    if (!response.data.data) {
      throw new Error('Failed to add item to cart');
    }
    return response.data.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, {
      quantity,
    });
    if (!response.data.data) {
      throw new Error('Failed to update cart item');
    }
    return response.data.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data.data || { _id: '', userId: 'guest', items: [], total: 0 };
  },

  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data.data || { _id: '', userId: 'guest', items: [], total: 0 };
  },
};

export const checkoutService = {
  processCheckout: async (checkoutData) => {
    const response = await api.post('/checkout', checkoutData);
    if (!response.data.data) {
      throw new Error('Checkout failed');
    }
    return response.data.data;
  },

  getOrders: async () => {
    const response = await api.get('/checkout/orders');
    return response.data.data || [];
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/checkout/orders/${orderNumber}`);
    if (!response.data.data) {
      throw new Error('Order not found');
    }
    return response.data.data;
  },
};

export default api;