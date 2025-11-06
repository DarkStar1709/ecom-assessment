import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/api';

const initialState = {
  cart: {
    _id: '',
    userId: 'guest',
    items: [],
    total: 0,
  },
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const refreshCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.addToCart(product._id, quantity);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.removeFromCart(itemId);
      dispatch({ type: 'SET_CART', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const clearedCart = await cartService.clearCart();
      dispatch({ type: 'SET_CART', payload: clearedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const value = {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;