
import React, { useState, useEffect } from 'react';
import { AppView, CartItem } from './types';
import { StoreFront } from './components/StoreFront';
import { AdminDashboard } from './components/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('STORE');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dn_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('dn_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if item with same variant exists
      const existing = prev.find(i => i.productId === item.productId && i.variantId === item.variantId);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartId));
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(i => i.id === cartId ? { ...i, quantity } : i));
  };

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-red-200 selection:text-red-900">
      {view === 'STORE' && (
        <StoreFront 
          onGoToAdmin={() => setView('ADMIN')} 
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
        />
      )}
      
      {view === 'ADMIN' && (
        <div className="relative">
          <button 
            onClick={() => setView('STORE')}
            className="fixed top-4 right-4 z-[100] px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold rounded-lg border border-zinc-200 shadow-sm transition"
          >
            Exit Admin
          </button>
          <AdminDashboard />
        </div>
      )}
    </div>
  );
};

export default App;
