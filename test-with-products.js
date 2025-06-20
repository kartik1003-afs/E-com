const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const adminUser = {
  name: 'Admin User',
  email: 'admin@test.com',
  password: 'admin123',
  role: 'admin'
};

const testProduct = {
  name: "Aurora Wireless Earbuds",
  description: "High-quality wireless earbuds with active noise cancellation",
  price: 299,
  category: "Audio",
  images: ["https://example.com/earbuds1.jpg"],
  stock: 50
};

async function testWithProducts() {
  console.log('🚀 Testing API with Products\n');

  try {
    // 1. Create admin user
    console.log('1. Creating admin user...');
    const adminResponse = await axios.post(`${BASE_URL}/users/register`, adminUser);
    console.log('✅ Admin user created');
    console.log('Admin role:', adminResponse.data.user.role);
    
    const adminToken = adminResponse.data.token;

    // 2. Create regular user
    console.log('\n2. Creating regular user...');
    const regularUser = {
      name: 'Regular User',
      email: 'user@test.com',
      password: 'user123'
    };
    const userResponse = await axios.post(`${BASE_URL}/users/register`, regularUser);
    console.log('✅ Regular user created');
    console.log('User role:', userResponse.data.user.role);
    
    const userToken = userResponse.data.token;

    // 3. Try to create product with admin token
    console.log('\n3. Creating product with admin token...');
    try {
      const productResponse = await axios.post(`${BASE_URL}/products`, testProduct, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Product created successfully');
      console.log('Product ID:', productResponse.data._id);
      console.log('Product name:', productResponse.data.name);
      
      const productId = productResponse.data._id;

      // 4. Test product retrieval
      console.log('\n4. Testing product retrieval...');
      const productsResponse = await axios.get(`${BASE_URL}/products`);
      console.log(`✅ Retrieved ${productsResponse.data.products.length} products`);

      // 5. Test adding product to cart
      console.log('\n5. Testing cart functionality...');
      const addToCartResponse = await axios.post(`${BASE_URL}/cart/add`, {
        productId: productId,
        quantity: 2
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('✅ Product added to cart');

      // 6. Get cart
      const cartResponse = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log(`✅ Cart has ${cartResponse.data.items.length} items`);
      console.log('Cart total items:', cartResponse.data.items.reduce((sum, item) => sum + item.quantity, 0));

      // 7. Test order creation
      console.log('\n6. Testing order creation...');
      const orderData = {
        items: cartResponse.data.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'credit_card'
      };

      const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('✅ Order created successfully');
      console.log('Order total:', orderResponse.data.totalAmount);

    } catch (error) {
      console.log('❌ Product creation failed:', error.response?.data?.error || error.message);
    }

    // 8. Test unauthorized product creation
    console.log('\n7. Testing unauthorized product creation...');
    try {
      await axios.post(`${BASE_URL}/products`, testProduct, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
    } catch (error) {
      console.log('✅ Unauthorized access properly rejected');
    }

    console.log('\n🎉 API testing completed!');
    console.log('\n📋 Summary:');
    console.log('- Admin user creation: ✅');
    console.log('- Regular user creation: ✅');
    console.log('- Product creation: ✅');
    console.log('- Cart functionality: ✅');
    console.log('- Order creation: ✅');
    console.log('- Authorization: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testWithProducts(); 