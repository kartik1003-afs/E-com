// Razorpay keys are loaded from environment variables
// Add these to your .env file in the server directory:
// RAZORPAY_KEY_ID=your_key_id
// RAZORPAY_KEY_SECRET=your_key_secret
//
const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 