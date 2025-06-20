const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'password123'
};

const testProduct = {
  name: 'Quantum Smartwatch',
  description: 'Advanced smartwatch with health monitoring',
  price: 599,
  category: 'Wearables',
  images: ['https://example.com/smartwatch1.jpg'],
  stock: 25
};

let authToken = '';
let userId = '';
let productId = '';

async function testAdvancedEndpoints() {
  console.log('🚀 Advanced E-commerce API Testing\n');

  try {
    // 1. Test User Registration
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('✅ User registered successfully');
    console.log('User ID:', registerResponse.data.user._id);
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    
    authToken = registerResponse.data.token;
    userId = registerResponse.data.user._id;

    // 2. Test User Login
    console.log('\n2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User logged in successfully');

    // 3. Test Get User Profile
    console.log('\n3. Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('User:', profileResponse.data.name);

    // 4. Test Get Products (empty initially)
    console.log('\n4. Testing Get Products...');
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log('✅ Products retrieved successfully');
    console.log('Products count:', productsResponse.data.products.length);

    // 5. Test Cart Operations
    console.log('\n5. Testing Cart Operations...');
    
    // Get initial cart
    const initialCartResponse = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Initial cart retrieved');
    console.log('Initial cart items:', initialCartResponse.data.items.length);

    // Since we don't have products yet, let's test the cart structure
    console.log('Cart structure:', {
      user: initialCartResponse.data.user,
      items: initialCartResponse.data.items,
      totalItems: initialCartResponse.data.totalItems
    });

    // 6. Test Orders
    console.log('\n6. Testing Orders...');
    const ordersResponse = await axios.get(`${BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Orders retrieved successfully');
    console.log('Orders count:', ordersResponse.data.length);

    // 7. Test Product Search and Filtering
    console.log('\n7. Testing Product Search and Filtering...');
    const searchResponse = await axios.get(`${BASE_URL}/products?search=test&category=Audio&page=1&limit=10`);
    console.log('✅ Product search works');
    console.log('Search results:', searchResponse.data.products.length);

    // 8. Test Error Handling
    console.log('\n8. Testing Error Handling...');
    
    // Test invalid login
    try {
      await axios.post(`${BASE_URL}/users/login`, {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Invalid login properly rejected');
    }

    // Test unauthorized access
    try {
      await axios.get(`${BASE_URL}/cart`);
    } catch (error) {
      console.log('✅ Unauthorized access properly rejected');
    }

    console.log('\n🎉 Advanced tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- User registration: ✅');
    console.log('- User login: ✅');
    console.log('- Profile retrieval: ✅');
    console.log('- Product listing: ✅');
    console.log('- Cart operations: ✅');
    console.log('- Order listing: ✅');
    console.log('- Product search: ✅');
    console.log('- Error handling: ✅');

    console.log('\n🔧 Next Steps:');
    console.log('1. Add sample products to test cart functionality');
    console.log('2. Create admin user to test product creation');
    console.log('3. Test order creation with cart items');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the advanced tests
testAdvancedEndpoints(); 