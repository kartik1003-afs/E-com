const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'Admin User';

  // Check if admin already exists
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({
    name,
    email,
    password: hashedPassword,
    role: 'admin',
  });
  await admin.save();
  console.log('Admin user created!');
  console.log('Email:', email);
  console.log('Password:', password);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('Error creating admin:', err);
  process.exit(1);
}); 