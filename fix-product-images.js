// const axios = require('axios');

// const BASE_URL = 'http://localhost:5000/api';

// // Sample image URLs for different categories
// const categoryImages = {
//   'Audio': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
//   'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
//   'Gaming': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
//   'Accessories': 'https://images.unsplash.com/photo-1609592806598-ef472b1f5656?w=500&h=500&fit=crop',
//   'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop',
//   'default': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop'
// };

// async function fixProductImages() {
//   console.log('🔧 Fixing product images...\n');

//   try {
//     // First, get admin token
//     console.log('1. Getting admin token...');
//     const adminLoginResponse = await axios.post(`${BASE_URL}/users/login`, {
//       email: 'admin@example.com',
//       password: 'admin123'
//     });
    
//     const adminToken = adminLoginResponse.data.token;
//     console.log('✅ Admin token obtained');

//     // Get all products
//     console.log('\n2. Fetching all products...');
//     const productsResponse = await axios.get(`${BASE_URL}/products`);
//     const products = productsResponse.data.products || productsResponse.data;
//     console.log(`✅ Found ${products.length} products`);

//     // Update each product
//     console.log('\n3. Updating products with images...');
//     for (const product of products) {
//       try {
//         // Check if product needs image update
//         if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
//           // Get appropriate image for category
//           const imageUrl = categoryImages[product.category] || categoryImages.default;
          
//           // Update product with images array
//           await axios.patch(`${BASE_URL}/products/${product._id}`, {
//             images: [imageUrl]
//           }, {
//             headers: { Authorization: `Bearer ${adminToken}` }
//           });
          
//           console.log(`✅ Updated: ${product.name} (${product.category})`);
//         } else {
//           console.log(`⏭️  Already has images: ${product.name}`);
//         }
//       } catch (error) {
//         console.log(`❌ Failed to update ${product.name}:`, error.response?.data?.error || error.message);
//       }
//     }

//     console.log('\n🎉 Product image fix completed!');
//     console.log('\n📱 Refresh your frontend to see the images!');

//   } catch (error) {
//     console.error('❌ Error:', error.response?.data || error.message);
    
//     if (error.response?.status === 401) {
//       console.log('\n💡 Tip: Make sure you have an admin user. Run: node create-admin.js');
//     }
//   }
// }

// // Run the fix
// fixProductImages();