import { useState, useEffect, createContext, useContext } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './useAuth.jsx';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load cart only when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user is not authenticated
      setCart([]);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.data.items || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      setError(null);
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.data.items || []);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to update cart' };
    }

    try {
      setError(null);
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data.items || []);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to remove items from cart' };
    }

    try {
      setError(null);
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data.items || []);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to clear cart' };
    }

    try {
      setError(null);
      await cartService.clearCart();
      setCart([]);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Calculate cart totals with safety checks
  const cartTotal = cart.reduce((total, item) => {
    if (!item?.product || typeof item.product.price !== 'number' || typeof item.quantity !== 'number') {
      return total;
    }
    return total + (item.product.price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((count, item) => {
    if (!item?.product || typeof item.quantity !== 'number') {
      return count;
    }
    return count + item.quantity;
  }, 0);

  const value = {
    cart,
    loading,
    error,
    cartTotal,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};