const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/paymentschema.js');
const User = require('../models/user.js');

require('dotenv').config();

// Debugging: Log environment variables
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order - Fixed amount
const createOrder = async (req, res) => {
  try {
    const fixedAmount = 4900; // ₹49.00 in paise
    console.log("Creating order for amount:", fixedAmount);

    const options = {
      amount: fixedAmount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order created successfully:", order.id);
    
    res.json({ 
      success: true,
      id: order.id,
      amount: order.amount 
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    
    // More detailed error information
    let errorMessage = error.message;
    if (error.error && error.error.description) {
      errorMessage = error.error.description;
    }
    if (error.statusCode) {
      console.error("HTTP Status:", error.statusCode);
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
};

// Verify Payment Signature
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Use req.result from your middleware
  if (!req.result || !req.result._id) {
    console.error("User not authenticated in verifyPayment");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    console.error("Signature verification failed");
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    const existing = await Payment.findOne({ userId: req.result._id });
    if (existing) {
      console.log("User already has premium access");
      return res.status(400).json({ message: "Already paid" });
    }

    await Payment.create({
      userId: req.result._id,
      paymentId: razorpay_payment_id,
    });

    await User.findByIdAndUpdate(req.result._id, { premiumUser: true });

    console.log("Premium unlocked for user:", req.result.email);
    res.json({ success: true, message: "Premium unlocked" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Check Premium Access
const checkPremiumAccess = async (req, res) => {
  try {
    // Use req.result from your middleware
    const user = await User.findById(req.result._id);
    res.json({ hasAccess: user?.premiumUser || false });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  checkPremiumAccess,
};