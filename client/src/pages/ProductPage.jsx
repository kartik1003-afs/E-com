import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../hooks/useCart.jsx';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Added to cart successfully!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/500x500?text=No+Image'} 
            alt={product.name} 
            className="w-full h-96 object-cover rounded-lg"
            onError={handleImageError}
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-600">
                ₹{(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
            {product.discount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You save ₹{(product.price * (product.discount / 100)).toFixed(2)}
              </p>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 