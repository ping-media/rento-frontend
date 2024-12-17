import axios from "axios";

export const razorPayment = async (currentUser, data, randomString) => {
  if (!data && !currentUser) return "Unable to make payment! Please try again.";

  // Function to dynamically load Razorpay Checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = (error) =>
        reject(new Error("Failed to load Razorpay script."));
      document.body.appendChild(script);
    });
  };

  // Wait for Razorpay script to load
  try {
    await loadRazorpayScript();
  } catch (error) {
    console.error("Script loading error:", error);
    return "Error loading Razorpay script. Please try again.";
  }

  // Ensure data is valid and extract payment amount
  const payableAmount =
    data?.bookingPrice?.userPay || data?.bookingPrice?.totalPrice || 100;

  // Razorpay options configuration
  const options = {
    key: import.meta.env.VITE_RAZOR_KEY_ID,
    amount: payableAmount * 100,
    order_id: `order_${randomString}`,
    name: "Rento",
    description: "Payment for your booking",
    handler: (response) => {
      // Log the payment response for debugging
      console.log("Payment Success Response:", response);
      if (response?.razorpay_payment_id) {
        // alert("Payment Successful!");
        return response;
      } else {
        console.error("Payment failed:", response);
        // alert("Oops! Something went wrong. Payment failed.");
      }
    },
    prefill: {
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      email: currentUser?.email,
      contact: currentUser?.contact,
    },
    theme: {
      color: "#e23844", // Payment widget color
    },
  };

  // Ensure Razorpay key exists and options are correctly set
  if (!options.key) {
    console.error("Razorpay key is missing or invalid.");
    return "Razorpay key is missing or invalid.";
  }

  // Open Razorpay payment window
  try {
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Error opening Razorpay:", error);
    alert("Failed to open Razorpay. Please try again.");
    return "Failed to open Razorpay.";
  }
};

export const createOrderId = async (data) => {
  if (!data) return "unable to process payment.";
  const key_id = import.meta.env.VITE_RAZOR_KEY_ID;
  const key_secret = import.meta.env.VITE_RAZOR_KEY_SECRET;

  // API endpoint for Razorpay order creation
  const url = "https://api.razorpay.com/v1/orders";

  const payableAmount =
    data?.bookingPrice?.userPay || data?.bookingPrice?.totalPrice || 100;

  const booking_id = data?.booking_id;
  const amount = payableAmount;

  // Prepare the order data to send
  const options = {
    amount: amount * 100, // Razorpay expects the amount in paise (100 paise = 1 INR)
    currency: "INR",
    receipt: "receipt#" + booking_id,
  };

  try {
    // Make the API request to Razorpay using axios
    const response = await axios.post(url, options, {
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: key_id,
        password: key_secret,
      },
    });

    console.log("Order created:", response.data);
    return response.data.id;
  } catch (error) {
    console.error(
      "Error creating Razorpay order:",
      error.response ? error.response.data : error.message
    );
  }
};
