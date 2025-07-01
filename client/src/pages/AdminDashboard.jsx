import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [],
    stock: ''
  });
  
  // Edit states
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [productUpdateLoading, setProductUpdateLoading] = useState(false);
  const [productUpdateError, setProductUpdateError] = useState(null);
  const [userUpdateLoading, setUserUpdateLoading] = useState(false);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For order details modal

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://e-com-5-y30p.onrender.com/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Handle paginated response
        setProducts(data.products || data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://e-com-5-y30p.onrender.com/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched orders data:', data); // Debugging line
        // Handle paginated response
        setOrders(data.orders || data);
      } else {
        console.error('Failed to fetch orders:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://e-com-5-y30p.onrender.com/api/users/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://e-com-5-y30p.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        alert('Product added successfully!');
        setNewProduct({
          name: '',
          description: '',
          price: '',
          category: '',
          images: [],
          stock: ''
        });
        // Refresh products list
        fetchProducts();
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  // Product edit and delete functions
  const handleEditProduct = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images || [],
      stock: product.stock
    });
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setProductUpdateLoading(true);
    setProductUpdateError(null);
    try {
      // Only send allowed fields
      const allowedFields = ['name', 'description', 'price', 'category', 'images', 'stock'];
      const payload = {};
      allowedFields.forEach(field => {
        if (field === 'price') {
          payload.price = Number(editingProduct.price);
        } else if (field === 'stock') {
          payload.stock = Number(editingProduct.stock);
        } else if (field === 'images') {
          payload.images = Array.isArray(editingProduct.images)
            ? editingProduct.images
            : (editingProduct.images || '').split(',').map(url => url.trim()).filter(url => url);
        } else {
          payload[field] = editingProduct[field];
        }
      });
      console.log('Updating product:', payload);
      const response = await fetch(`https://e-com-5-y30p.onrender.com/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert('Product updated successfully!');
        setShowEditProductModal(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        setProductUpdateError(errorData.error || 'Unknown error');
        alert(`Failed to update product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setProductUpdateError(error.message);
      console.error('Error updating product:', error);
      alert('Error updating product: ' + error.message);
    } finally {
      setProductUpdateLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://e-com-5-y30p.onrender.com/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  // User edit and delete functions
  const handleEditUser = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUserUpdateLoading(true);
    setUserUpdateError(null);
    try {
      const payload = {
        ...editingUser,
        name: editingUser.name || '',
        email: editingUser.email || '',
        role: editingUser.role || 'user'
      };
      console.log('Updating user:', payload);
      const response = await fetch(`https://e-com-5-y30p.onrender.com/api/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert('User updated successfully!');
        setShowEditUserModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        const errorData = await response.json();
        setUserUpdateError(errorData.error || 'Unknown error');
        alert(`Failed to update user: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setUserUpdateError(error.message);
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    } finally {
      setUserUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://e-com-5-y30p.onrender.com/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://e-com-5-y30p.onrender.com/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        // Update the state to reflect the change immediately
        setOrders(currentOrders => 
          currentOrders.map(order => 
            order._id === orderId ? updatedOrder : order
          )
        );
        alert('Order status updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating status.');
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <button onClick={() => setActiveTab('products')} className="text-left bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 transition-colors">
        <h3 className="text-lg font-semibold mb-2">Total Products</h3>
        <p className="text-3xl font-bold">{products.length}</p>
      </button>
      <button onClick={() => setActiveTab('orders')} className="text-left bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 transition-colors">
        <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
        <p className="text-3xl font-bold">{orders.length}</p>
      </button>
      <button onClick={() => setActiveTab('users')} className="text-left bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600 transition-colors">
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-3xl font-bold">{users.length}</p>
      </button>
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL (comma-separated for multiple images)"
            value={newProduct.images ? newProduct.images.join(', ') : ''}
            onChange={(e) => setNewProduct({...newProduct, images: e.target.value.split(',').map(url => url.trim()).filter(url => url)})}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            className="border p-2 rounded md:col-span-2"
            rows="3"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 md:col-span-2"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">All Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">₹{product.price}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">All Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.user?.name}</td>
                <td className="px-4 py-2">₹{order.totalAmount}</td>
                <td className="px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`p-1 rounded text-sm border-2 ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">All Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-500 hover:text-gray-800"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Core Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600">Order ID:</p>
                <p className="text-gray-800 font-mono break-all">{selectedOrder._id}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600">Customer:</p>
                <p className="text-gray-800">{selectedOrder.user?.name || 'N/A'} ({selectedOrder.user?.email || 'N/A'})</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600">Order Date:</p>
                <p className="text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-600">Total Amount:</p>
                <p className="text-2xl font-bold text-green-600">₹{selectedOrder.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Items Purchased */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Items Purchased</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map(item => (
                      <tr key={item.product?._id || item._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{item.product?.name || 'Product not found'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">₹{item.price?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Payment Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                  <p><strong className="text-gray-600">Method:</strong> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.paymentDetails && (
                    <>
                      <p><strong className="text-gray-600">Payment ID:</strong> <span className="font-mono break-all">{selectedOrder.paymentDetails.razorpay_payment_id}</span></p>
                      <p><strong className="text-gray-600">Order ID:</strong> <span className="font-mono break-all">{selectedOrder.paymentDetails.razorpay_order_id}</span></p>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Shipping Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'products' && renderProducts()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'users' && renderUsers()}

      {/* Modals */}
      {renderOrderDetailsModal()}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={editingProduct.name || ''}
                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={editingProduct.category || ''}
                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={editingProduct.price || ''}
                onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={editingProduct.stock || ''}
                onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Image URLs (comma-separated)"
                value={Array.isArray(editingProduct.images) ? editingProduct.images.join(', ') : (editingProduct.images || '')}
                onChange={(e) => setEditingProduct({...editingProduct, images: e.target.value.split(',').map(url => url.trim()).filter(url => url)})}
                className="border p-2 rounded w-full"
              />
              <textarea
                placeholder="Description"
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                className="border p-2 rounded w-full"
                rows="3"
                required
              />
              {productUpdateError && <div className="text-red-500">{productUpdateError}</div>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                  disabled={productUpdateLoading}
                >
                  {productUpdateLoading ? 'Updating...' : 'Update Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1"
                  disabled={productUpdateLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editingUser.name || ''}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <select
                value={editingUser.role || 'user'}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                className="border p-2 rounded w-full"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {userUpdateError && <div className="text-red-500">{userUpdateError}</div>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                  disabled={userUpdateLoading}
                >
                  {userUpdateLoading ? 'Updating...' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1"
                  disabled={userUpdateLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 