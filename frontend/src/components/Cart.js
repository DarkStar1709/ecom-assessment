import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  if (!isOpen) return null;

  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      return newSet;
    });
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      return newSet;
    });
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <ShoppingBag size={24} />
            <span>Your Cart ({totalItems})</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-center px-4">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className={`bg-gray-50 rounded-lg p-4 ${
                    updatingItems.has(item._id) ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={getOptimizedImageUrl(item.productId.image, 64, 64, 75)}
                      alt={item.productId.name}
                      loading="lazy"
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        const target = e.target;
                        target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.productId.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        ${item.price.toFixed(2)} each
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItems.has(item._id)}
                            className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                            disabled={updatingItems.has(item._id)}
                            className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={updatingItems.has(item._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="mt-2 text-right">
                        <span className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={onCheckout}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={handleClearCart}
                disabled={loading}
                className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 py-2 rounded-lg font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;