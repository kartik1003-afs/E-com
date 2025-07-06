import React, { useState } from 'react';
import { useCart } from '../hooks/useCart.jsx';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, cartTotal, updateCartItem, removeFromCart, clearCart, loading, error } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      setUpdatingItems(prev => new Set(prev).add(productId));
      try {
        await updateCartItem(productId, newQuantity);
      } finally {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (isProcessingCheckout) return; // Prevent double clicks
    
    setIsProcessingCheckout(true);
    
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
        return;
      }

      // Call backend to create order
      const orderRes = await fetch('https://e-com-5-y30p.onrender.com/api/payment/create-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: cartTotal })
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create payment order');
      }

      const order = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'E-Commerce Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            const orderData = {
              items: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
              })),
              shippingAddress: {
                street: '308 Negra Arroyo Lane',
                city: 'Albuquerque',
                postalCode: '87104',
                country: 'New Mexico',
              },
              paymentMethod: 'Razorpay',
              paymentDetails: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            };

            const createOrderRes = await fetch('https://e-com-5-y30p.onrender.com/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(orderData),
            });

            if (createOrderRes.ok) {
              const newOrder = await createOrderRes.json();
              alert(`Payment successful! Order created with ID: ${newOrder._id}`);
              await clearCart();
              navigate('/profile', { replace: true });
            } else {
              const errorData = await createOrderRes.json();
              alert(`Failed to create order: ${errorData.error || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating your order. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessingCheckout(false);
          }
        },
        prefill: {},
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => {
            if (!item.product) {
              return (
                <div key={item._id} className="border rounded-lg p-4 mb-4 flex items-center bg-red-50">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-red-600">Product unavailable</h3>
                    <p className="text-gray-500 text-sm">This product is no longer available.</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              );
            }
            const isUpdating = updatingItems.has(item.product._id);
            return (
              <div key={item._id} className="border rounded-lg p-4 mb-4 flex items-center">
                <img 
                  src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/100x100?text=No+Image'} 
                  alt={item.product.name || 'No Name'} 
                  className="w-20 h-20 object-cover rounded mr-4"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.product.name || 'No Name'}</h3>
                  <p className="text-gray-600">₹{item.product.price || 0}</p>
                  <p className="text-sm text-gray-500">Stock: {item.product.stock || 0}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={isUpdating}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= (item.product.stock || 0)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    disabled={isUpdating}
                    className="ml-4 text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          
          <button
            onClick={handleClearCart}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessingCheckout || cart.length === 0}
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessingCheckout ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;