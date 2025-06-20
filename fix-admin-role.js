const mongoose = require('mongoose');

// Update this with your actual MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// User schema (minimal for script)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
});
const User = mongoose.model('User', userSchema);

async function fixAdminRole() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Creating new admin user...');
      
      // Create new admin user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      console.log('Role: admin');
      
    } else {
      // Update existing user's role to admin
      adminUser.role = 'admin';
      await adminUser.save();
      
      console.log('✅ Admin user role updated successfully!');
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
    }
    
    // Verify the change
    const updatedUser = await User.findOne({ email: 'admin@example.com' });
    console.log('\nVerification:');
    console.log('Email:', updatedUser.email);
    console.log('Role:', updatedUser.role);
    console.log('Name:', updatedUser.name);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

fixAdminRole(); 