'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync cart from backend when user logs in, or load from localStorage for guest
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // If logged in, fetch from backend API
          const response = await api.getCart();
          // Adjust response structure based on mock/real structure
          // Mock structure is { items: [ { id, product, quantity } ], totalPrice }
          setCartItems(response?.items || []);
        } else {
          // If guest, load from localStorage
          const localCart = localStorage.getItem('guest_cart');
          if (localCart) {
            setCartItems(JSON.parse(localCart));
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, user]);

  // Keep localStorage in sync for guest users
  const saveLocalCart = (items) => {
    if (!isAuthenticated) {
      localStorage.setItem('guest_cart', JSON.stringify(items));
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        // Sync with API
        const response = await api.addToCart(product.id, quantity);
        setCartItems(response.items);
      } else {
        // Handle guest local storage cart
        setCartItems(prevItems => {
          const existingIndex = prevItems.findIndex(item => item.product.id === product.id);
          let newItems;
          
          if (existingIndex > -1) {
            newItems = [...prevItems];
            newItems[existingIndex].quantity += quantity;
          } else {
            newItems = [...prevItems, { id: 'local-' + Math.random().toString(36).substr(2, 9), product, quantity }];
          }
          saveLocalCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (isAuthenticated) {
        const response = await api.updateCartItem(productId, quantity);
        setCartItems(response.items);
      } else {
        setCartItems(prevItems => {
          let newItems;
          if (quantity <= 0) {
            newItems = prevItems.filter(item => item.product.id !== productId);
          } else {
            newItems = prevItems.map(item => 
              item.product.id === productId ? { ...item, quantity } : item
            );
          }
          saveLocalCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        const response = await api.removeFromCart(productId);
        setCartItems(response.items);
      } else {
        setCartItems(prevItems => {
          const newItems = prevItems.filter(item => item.product.id !== productId);
          saveLocalCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await api.clearCart();
      } else {
        localStorage.removeItem('guest_cart');
      }
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Helper getters
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = parseFloat(
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
