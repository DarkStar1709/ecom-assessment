import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import './App.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCartOpen = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);
  
  const handleCheckoutOpen = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  
  const handleCheckoutClose = () => setIsCheckoutOpen(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={handleCartOpen} />
        <main>
          <ProductGrid />
        </main>
        <Cart
          isOpen={isCartOpen}
          onClose={handleCartClose}
          onCheckout={handleCheckoutOpen}
        />
        <Checkout
          isOpen={isCheckoutOpen}
          onClose={handleCheckoutClose}
        />
      </div>
    </CartProvider>
  );
}

export default App;
