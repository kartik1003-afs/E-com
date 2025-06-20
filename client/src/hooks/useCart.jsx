import { useState, useEffect, createContext, useContext } from 'react';
import { cartService } from '../services/api';

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

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data.items || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.data.items || []);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setError(null);
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data.items || []);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setError(null);
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data.items || []);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      return { success: false, error: err.response?.data?.message };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart();
      setCart([]);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => {
    if (!item.product || typeof item.product.price !== 'number') return total;
    return total + (item.product.price * (item.quantity || 1));
  }, 0);

  const cartCount = cart.reduce((count, item) => {
    if (!item.product || typeof item.quantity !== 'number') return count;
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