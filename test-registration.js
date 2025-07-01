// const axios = require('axios');

// const testRegistration = async () => {
//   try {
//     console.log('Testing registration endpoint...');
    
//     const response = await axios.post('http://localhost:5000/api/users/register', {
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'password123'
//     });
    
//     console.log('✅ Registration successful!');
//     console.log('Response:', response.data);
    
//     // Test login
//     console.log('\nTesting login endpoint...');
//     const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
//       email: 'test@example.com',
//       password: 'password123'
//     });
    
//     console.log('✅ Login successful!');
//     console.log('Token:', loginResponse.data.token);
    
//   } catch (error) {
//     console.error('❌ Error:', error.response?.data || error.message);
//   }
// };

// testRegistration(); 