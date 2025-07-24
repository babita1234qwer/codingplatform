import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosclient';

const PaymentButton = ({ onSuccess }) => {
  const fixedAmount = 200; // Fixed amount in rupees
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) return;
      
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay loaded");
      document.body.appendChild(script);
    };
    
    loadRazorpay();
  }, []);
const handlePayment = async () => {
  if (!window.Razorpay) {
    alert("Payment system is loading, please try again in a moment");
    return;
  }

  try {
    console.log("Creating order...");
    const { data: order } = await axiosClient.post('/payment/create-order');
    console.log("Order created:", order);
console.log("Using Razorpay key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Coding Platform",
      description: "Editorial Access",
      order_id: order.id,
      handler: async (response) => {
        try {
          console.log("Payment response:", response);
          const verify = await axiosClient.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          console.log("Verification response:", verify.data);

          if (verify.data.success) {
            alert('Payment Successful! Editorial access granted.');
            onSuccess();
          } else {
            alert('Payment verification failed');
          }
        } catch (error) {
          console.error("Verification error:", error);
          if (error.response) {
            console.error("Verification error details:", error.response.data);
          }
          alert('Payment verification error: ' + error.message);
        }
      },
      prefill: {
        name: user?.name || "User",
        email: user?.email || "user@example.com",
      },
      theme: {
        color: "#ffa116",
      },
      modal: {
        ondismiss: () => console.log("Payment modal dismissed")
      }
    };

    console.log("Razorpay options:", options);
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment initiation error:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    alert('Error initiating payment: ' + error.message);
  }
};

  return (
    <button 
      onClick={handlePayment} 
      className="bg-[#ffa116] px-4 py-2 rounded text-[#232323] font-bold hover:bg-[#e69100] transition-colors"
    >
      Pay ₹{fixedAmount} {/* Display fixed amount */}
    </button>
  );
};

export default PaymentButton;