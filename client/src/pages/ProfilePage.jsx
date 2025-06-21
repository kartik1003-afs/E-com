import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Using the central API instance
import { useAuth } from '../hooks/useAuth.jsx';

const ProfilePage = () => {
  const { user, setUser } = useAuth(); // Get setUser from context to update it globally
  
  // State for the full user profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for the address form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
        // Initialize form data with fetched profile
        setFormData({
          name: data.name,
          email: data.email,
          address: data.address || { street: '', city: '', state: '', zipCode: '', country: '' }
        });
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const { data: updatedUser } = await api.put('/users/profile', formData);
      setProfile(updatedUser);
      // Perform a controlled update of the global user state
      setUser(prevUser => ({
        ...prevUser,
        name: updatedUser.name,
        email: updatedUser.email
      }));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // The rest of your component remains the same
  // ...
  // Order history fetching logic...
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading profile...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Address */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Details Card */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Details</h2>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <h3 className="text-xl font-bold mt-6 mb-2 text-gray-800">Shipping Address</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street</label>
                  <input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                  <input type="text" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input type="text" name="country" value={formData.address.country} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-lg text-gray-800">{profile?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-lg text-gray-800">{profile?.email}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Default Shipping Address</h3>
                  {profile?.address && Object.values(profile.address).some(field => field) ? (
                    <div className="text-lg text-gray-800">
                      <p>{profile.address.street}</p>
                      <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
                      <p>{profile.address.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No default address saved.</p>
                  )}
                </div>
                <div className="text-right pt-4">
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Edit Profile & Address</button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column: Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Order History</h2>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 transition hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg text-gray-700">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-600">₹{order.totalAmount.toLocaleString()}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-md text-gray-600 mb-2">Items:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {order.items.map(item => (
                          <li key={item._id}>
                            {item.product?.name || 'Item not available'} - {item.quantity} x ₹{item.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-md text-gray-600 mb-2">Shipped To:</h4>
                      <p className="text-sm text-gray-700">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't placed any orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 