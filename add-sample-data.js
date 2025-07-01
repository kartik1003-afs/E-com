// const axios = require('axios');

// const BASE_URL = 'http://localhost:5000/api';

// // Sample products data
// const sampleProducts = [
//   {
//     name: "Aurora Wireless Earbuds",
//     description: "High-quality wireless earbuds with active noise cancellation and 30-hour battery life",
//     price: 299,
//     category: "Audio",
//     images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop"],
//     stock: 50
//   },
//   {
//     name: "Quantum Smartwatch",
//     description: "Advanced smartwatch with health monitoring, GPS, and water resistance",
//     price: 599,
//     category: "Wearables",
//     images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
//     stock: 25
//   },
//   {
//     name: "Nebula Gaming Mouse",
//     description: "RGB gaming mouse with 25,600 DPI sensor and programmable buttons",
//     price: 129,
//     category: "Gaming",
//     images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop"],
//     stock: 100
//   },
//   {
//     name: "Prism Mechanical Keyboard",
//     description: "Mechanical keyboard with Cherry MX switches and RGB backlighting",
//     price: 249,
//     category: "Gaming",
//     images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop"],
//     stock: 30
//   },
//   {
//     name: "Infinity Charging Station",
//     description: "Multi-device wireless charging station with fast charging support",
//     price: 89,
//     category: "Accessories",
//     images: ["https://images.unsplash.com/photo-1609592806598-ef472b1f5656?w=500&h=500&fit=crop"],
//     stock: 75
//   }
// ];

// // Test user data
// const testUser = {
//   name: 'Test Customer',
//   email: 'customer@example.com',
//   password: 'password123'
// };

// let authToken = '';
// let productIds = [];

// async function addSampleData() {
//   console.log('🚀 Adding Sample Data to E-commerce API\n');

//   try {
//     // 1. Register a test user
//     console.log('1. Registering test user...');
//     const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
//     authToken = registerResponse.data.token;
//     console.log('✅ User registered successfully');

//     // 2. Create admin user for product creation
//     console.log('\n2. Creating admin user...');
//     const adminUser = {
//       name: 'Admin User',
//       email: 'admin@example.com',
//       password: 'admin123',
//       role: 'admin'
//     };
    
//     const adminResponse = await axios.post(`${BASE_URL}/users/register`, adminUser);
//     const adminToken = adminResponse.data.token;
//     console.log('✅ Admin user created');

//     // 3. Add sample products (using admin token)
//     console.log('\n3. Adding sample products...');
//     for (const product of sampleProducts) {
//       try {
//         const productResponse = await axios.post(`${BASE_URL}/products`, product, {
//           headers: { Authorization: `Bearer ${adminToken}` }
//         });
//         productIds.push(productResponse.data._id);
//         console.log(`✅ Added: ${product.name}`);
//       } catch (error) {
//         console.log(`❌ Failed to add ${product.name}:`, error.response?.data?.error || error.message);
//       }
//     }

//     // 4. Test product retrieval
//     console.log('\n4. Testing product retrieval...');
//     const productsResponse = await axios.get(`${BASE_URL}/products`);
//     console.log(`✅ Retrieved ${productsResponse.data.products.length} products`);

//     // 5. Test cart functionality with real products
//     console.log('\n5. Testing cart functionality...');
    
//     if (productIds.length > 0) {
//       // Add first product to cart
//       const addToCartResponse = await axios.post(`${BASE_URL}/cart/add`, {
//         productId: productIds[0],
//         quantity: 2
//       }, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       console.log('✅ Added product to cart');

//       // Add second product to cart
//       if (productIds.length > 1) {
//         await axios.post(`${BASE_URL}/cart/add`, {
//           productId: productIds[1],
//           quantity: 1
//         }, {
//           headers: { Authorization: `Bearer ${authToken}` }
//         });
//         console.log('✅ Added second product to cart');
//       }

//       // Get updated cart
//       const cartResponse = await axios.get(`${BASE_URL}/cart`, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       console.log(`✅ Cart now has ${cartResponse.data.items.length} items`);
//       console.log('Cart total items:', cartResponse.data.items.reduce((sum, item) => sum + item.quantity, 0));

//       // 6. Test order creation
//       console.log('\n6. Testing order creation...');
//       const orderData = {
//         items: cartResponse.data.items.map(item => ({
//           product: item.product._id,
//           quantity: item.quantity,
//           price: item.product.price
//         })),
//         shippingAddress: {
//           street: '123 Test Street',
//           city: 'Test City',
//           state: 'Test State',
//           zipCode: '12345',
//           country: 'Test Country'
//         },
//         paymentMethod: 'credit_card'
//       };

//       const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       console.log('✅ Order created successfully');
//       console.log('Order ID:', orderResponse.data._id);
//       console.log('Order total:', orderResponse.data.totalAmount);

//       // 7. Test order retrieval
//       console.log('\n7. Testing order retrieval...');
//       const ordersResponse = await axios.get(`${BASE_URL}/orders/my-orders`, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       console.log(`✅ Retrieved ${ordersResponse.data.length} orders`);
//     }

//     console.log('\n🎉 Sample data added successfully!');
//     console.log('\n📊 Summary:');
//     console.log(`- Products added: ${productIds.length}`);
//     console.log(`- Test user created: ${testUser.email}`);
//     console.log(`- Admin user created: admin@example.com`);
//     console.log('- Cart functionality tested');
//     console.log('- Order creation tested');

//     console.log('\n🔗 Test URLs:');
//     console.log(`- Products: ${BASE_URL}/products`);
//     console.log(`- Cart: ${BASE_URL}/cart (with auth token)`);
//     console.log(`- Orders: ${BASE_URL}/orders/my-orders (with auth token)`);

//   } catch (error) {
//     console.error('❌ Error:', error.response?.data || error.message);
//   }
// }

// // Run the sample data addition
// addSampleData(); 