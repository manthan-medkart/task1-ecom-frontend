'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [toast, setToast] = useState({ message: null, type: null });

  // Helper to show visual toast feedback
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: null, type: null });
    }, 4000);
  }, []);

  const fetchCart = useCallback(async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    try {
      const cartData = await api.getCart(activeToken);
      setCart(cartData);
    } catch (err) {
      const errMsg = err?.message || '';
      if (errMsg.includes('Unauthorized') || errMsg.includes('expired') || errMsg.includes('JWT') || errMsg.includes('token')) {
        // Token is invalid or expired. Reset state and local storage.
        setToken(null);
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.warn('Failed to fetch cart:', err);
      }
    }
  }, [token]);

  // Load auth state from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
        fetchCart(storedToken);
      }
      setInitialized(true);
    }
  }, [fetchCart]);

  // User Login
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      // Response shape: { data: { accessToken, userDto } }
      const authData = response.data;
      if (authData && authData.accessToken) {
        setToken(authData.accessToken);
        setUser(authData.userDto);
        localStorage.setItem('token', authData.accessToken);
        localStorage.setItem('user', JSON.stringify(authData.userDto));
        showToast(`Welcome back, ${authData.userDto.name || 'User'}!`, 'success');
        
        // Fetch cart details
        await fetchCart(authData.accessToken);
        setLoading(false);
        return authData;
      } else {
        throw new Error('Access token missing in login response.');
      }
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
      throw err;
    }
  };

  // User Signup + Auto Login
  const signupUser = async (name, email, password) => {
    setLoading(true);
    try {
      await api.signup(name, email, password);
      showToast('Registration successful! Logging you in...', 'success');
      
      // Auto Login
      return await loginUser(email, password);
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Signup failed.', 'error');
      throw err;
    }
  };

  // User Logout
  const logoutUser = () => {
    setToken(null);
    setUser(null);
    setCart({ items: [], totalPrice: 0 });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully.', 'success');
  };

  // Cart actions
  const addItemToCart = async (productId, quantity = 1) => {
    if (!token) {
      showToast('Please login to add items to cart.', 'error');
      return false;
    }
    try {
      const updatedCart = await api.addToCart(productId, quantity, token);
      setCart(updatedCart);
      showToast('Item added to cart.', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Could not add item to cart.', 'error');
      return false;
    }
  };

  const updateItemQty = async (productId, quantity) => {
    if (!token) return;
    try {
      const updatedCart = await api.updateCart(productId, quantity, token);
      setCart(updatedCart);
      showToast('Cart updated.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not update item quantity.', 'error');
    }
  };

  const removeItem = async (productId) => {
    if (!token) return;
    try {
      const updatedCart = await api.removeFromCart(productId, token);
      setCart(updatedCart);
      showToast('Item removed from cart.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not remove item.', 'error');
    }
  };

  const clearCartItems = async () => {
    if (!token) return;
    try {
      const updatedCart = await api.clearCart(token);
      setCart(updatedCart);
      showToast('Cart cleared.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not clear cart.', 'error');
    }
  };

  const refreshCartState = useCallback(async () => {
    await fetchCart(token);
  }, [fetchCart, token]);

  const cartCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        cart,
        cartCount,
        loading,
        initialized,
        toast,
        showToast,
        loginUser,
        signupUser,
        logoutUser,
        fetchCart,
        addItemToCart,
        updateItemQty,
        removeItem,
        clearCartItems,
        refreshCartState
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
