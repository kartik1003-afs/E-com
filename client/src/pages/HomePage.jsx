import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { useCart } from '../hooks/useCart.jsx';

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount_desc', label: 'Discount: High to Low' },
  { value: 'discount_asc', label: 'Discount: Low to High' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'rating_asc', label: 'Rating: Low to High' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(new Set());
  const { addToCart } = useCart();

  // Filter state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [discounted, setDiscounted] = useState(false);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, [selectedCategory, minPrice, maxPrice, inStock, discounted, sort, debouncedSearch]);

  const fetchCategories = async () => {
    try {
      const res = await productService.getAll({});
      // fallback: extract unique categories from products if /categories endpoint not available
      const cats = Array.from(new Set((res.data.products || []).map(p => p.category)));
      setCategories(cats);
      // Try to fetch from backend endpoint if available
      try {
        const catRes = await productService.getCategories?.();
        if (catRes?.data && Array.isArray(catRes.data)) setCategories(catRes.data);
      } catch {}
    } catch {}
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (inStock) params.inStock = true;
      if (discounted) params.discounted = true;
      if (sort) params.sort = sort;
      if (debouncedSearch) params.search = debouncedSearch;
      const response = await productService.getAll(params);
      setProducts(response.data.products || []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart(prev => new Set(prev).add(productId));
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        alert('Added to cart successfully!');
      } else {
        alert(result.error || 'Failed to add to cart');
      }
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading products</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={loadProducts}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] px-0 py-12 relative">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-widest drop-shadow-lg font-mono">Welcome to Our Store</h1>
      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for products..."
            className="w-full py-3 pl-12 pr-4 rounded-2xl bg-white/20 text-cyan-200 font-mono border-2 border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-xl neon-glow placeholder-cyan-300 text-lg"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
        </div>
      </div>
      <div className="flex gap-8 max-w-8xl mx-auto mt-0">
        {/* Sidebar Filter Panel */}
        <aside className="h-fit min-w-[320px] max-w-xs bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border-4 border-cyan-400/40 neon-glow p-8 glass-card animate-float flex flex-col gap-6 self-start mt-0">
          <div className="flex flex-col items-start min-w-[140px] mb-2">
            <label className="block text-xs font-bold mb-1 text-purple-300 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 18h18M9 6l3 6 3-6"/></svg> Sort By
            </label>
            <select
              className="border-2 border-purple-400 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white/20 shadow-md w-full text-purple-800 font-mono"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start min-w-[140px]">
            <label className="block text-xs font-bold mb-1 text-cyan-300 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-2 0v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V7"/></svg> Category
            </label>
            <select
              className="border-2 border-cyan-400 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white/20 shadow-md w-full text-cyan-800 font-mono"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start min-w-[100px]">
            <label className="block text-xs font-bold mb-1 text-green-300 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/></svg> Min Price
            </label>
            <input
              type="number"
              className="border-2 border-green-400 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white/20 shadow-md w-full text-green-200 font-mono"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              min="0"
            />
          </div>
          <div className="flex flex-col items-start min-w-[100px]">
            <label className="block text-xs font-bold mb-1 text-pink-300 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 16V12l-3-3"/></svg> Max Price
            </label>
            <input
              type="number"
              className="border-2 border-pink-400 rounded-xl px-3 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/20 shadow-md w-full text-pink-200 font-mono"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>
          <div className="flex items-center gap-2 min-w-[110px]">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={e => setInStock(e.target.checked)}
              className="accent-cyan-400 h-5 w-5 rounded-full border-2 border-cyan-300 shadow-md neon-glow"
            />
            <label htmlFor="inStock" className="text-xs font-bold text-cyan-200 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg> In Stock
            </label>
          </div>
          <div className="flex items-center gap-2 min-w-[120px]">
            <input
              type="checkbox"
              id="discounted"
              checked={discounted}
              onChange={e => setDiscounted(e.target.checked)}
              className="accent-pink-400 h-5 w-5 rounded-full border-2 border-pink-300 shadow-md neon-glow"
            />
            <label htmlFor="discounted" className="text-xs font-bold text-pink-200 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="11" y="3" width="2" height="18" rx="1"/></svg> Discounted
            </label>
          </div>
          <button
            className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-white font-extrabold rounded-2xl shadow-xl neon-glow hover:from-cyan-500 hover:to-pink-500 transition-all animate-pulse"
            onClick={() => {
              setSelectedCategory('');
              setMinPrice('');
              setMaxPrice('');
              setInStock(false);
              setDiscounted(false);
              setSort('');
            }}
          >
            Reset
          </button>
        </aside>
        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-0">
          {products.map((product) => {
            const isAdding = addingToCart.has(product._id);
            return (
              <div key={product._id} className="relative border-0 rounded-3xl p-5 shadow-2xl bg-white/10 backdrop-blur-2xl hover:scale-105 hover:shadow-neon transition-all duration-300 flex flex-col glass-card neon-border animate-float-card">
                <div className="relative mb-4">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-2xl border-4 border-cyan-400/40 shadow-lg neon-glow"
                    onError={handleImageError}
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-extrabold px-4 py-1 rounded-full shadow-xl neon-glow animate-bounce">
                      {product.discount}% OFF
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <span className="absolute top-2 right-2 bg-red-700 text-white px-4 py-1 rounded-full text-xs font-extrabold shadow-xl neon-glow animate-pulse">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold mb-1 text-cyan-200 truncate font-mono tracking-wide drop-shadow">{product.name}</h3>
                <p className="text-gray-300 text-xs mb-2 line-clamp-2 min-h-[32px] font-mono">{product.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-extrabold text-zinc-700 drop-shadow">₹{product.price}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through font-mono">
                      ₹{Math.round(product.price / (1 - product.discount / 100))}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-4 font-mono">Stock: {product.stock}</p>
                <button 
                  onClick={() => handleAddToCart(product._id)}
                  disabled={isAdding || product.stock <= 0}
                  className={`w-full px-4 py-2 rounded-xl font-extrabold transition-all duration-150 shadow-lg neon-glow font-mono tracking-wider text-lg ${
                    product.stock <= 0 
                      ? 'bg-gray-800/60 text-gray-500 cursor-not-allowed'
                      : isAdding
                      ? 'bg-cyan-400/80 text-white cursor-wait animate-pulse'
                      : 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-white hover:from-cyan-500 hover:to-pink-500 animate-glow'
                  }`}
                >
                  {isAdding ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
        {products.length === 0 && (
          <div className="text-center text-cyan-200 mt-16 animate-fade-in">
            <p className="text-2xl font-mono font-bold">No products available at the moment.</p>
            <p className="text-sm">Please check back later or contact an admin to add products.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 