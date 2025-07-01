// const axios = require('axios');

// const BASE_URL = 'http://localhost:5000/api';

// // Test data
// const testUser = {
//   name: 'John Doe',
//   email: 'john@example.com',
//   password: 'password123'
// };

// const testProduct = {
//   name: 'Aurora Wireless Earbuds',
//   description: 'High-quality wireless earbuds with noise cancellation',
//   price: 299,
//   category: 'Audio',
//   images: ['https://example.com/earbuds1.jpg'],
//   stock: 50
// };

// let authToken = '';
// let userId = '';
// let productId = '';

// async function testEndpoints() {
//   console.log('🚀 Testing E-commerce API Endpoints\n');

//   try {
//     // 1. Test User Registration
//     console.log('1. Testing User Registration...');
//     const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
//     console.log('✅ User registered successfully');
//     console.log('User ID:', registerResponse.data.user._id);
//     console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    
//     authToken = registerResponse.data.token;
//     userId = registerResponse.data.user._id;

//     // 2. Test User Login
//     console.log('\n2. Testing User Login...');
//     const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
//       email: testUser.email,
//       password: testUser.password
//     });
//     console.log('✅ User logged in successfully');
//     console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');

//     // 3. Test Get User Profile
//     console.log('\n3. Testing Get User Profile...');
//     const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
//       headers: { Authorization: `Bearer ${authToken}` }
//     });
//     console.log('✅ Profile retrieved successfully');
//     console.log('User:', profileResponse.data.name);

//     // 4. Test Create Product (Admin only - will fail)
//     console.log('\n4. Testing Create Product (should fail - not admin)...');
//     try {
//       await axios.post(`${BASE_URL}/products`, testProduct, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//     } catch (error) {
//       console.log('✅ Expected error - Access denied (not admin)');
//     }

//     // 5. Test Get Products
//     console.log('\n5. Testing Get Products...');
//     const productsResponse = await axios.get(`${BASE_URL}/products`);
//     console.log('✅ Products retrieved successfully');
//     console.log('Products count:', productsResponse.data.products.length);

//     // 6. Test Cart Operations
//     console.log('\n6. Testing Cart Operations...');
    
//     // Get cart
//     const cartResponse = await axios.get(`${BASE_URL}/cart`, {
//       headers: { Authorization: `Bearer ${authToken}` }
//     });
//     console.log('✅ Cart retrieved successfully');
//     console.log('Cart items:', cartResponse.data.items.length);

//     // 7. Test Orders
//     console.log('\n7. Testing Orders...');
//     const ordersResponse = await axios.get(`${BASE_URL}/orders/my-orders`, {
//       headers: { Authorization: `Bearer ${authToken}` }
//     });
//     console.log('✅ Orders retrieved successfully');
//     console.log('Orders count:', ordersResponse.data.length);

//     console.log('\n🎉 All tests completed successfully!');
//     console.log('\n📋 Summary:');
//     console.log('- User registration: ✅');
//     console.log('- User login: ✅');
//     console.log('- Profile retrieval: ✅');
//     console.log('- Product listing: ✅');
//     console.log('- Cart operations: ✅');
//     console.log('- Order listing: ✅');

//   } catch (error) {
//     console.error('❌ Test failed:', error.response?.data || error.message);
//   }
// }

// // Run the tests
// testEndpoints(); 