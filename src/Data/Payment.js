export const razorPayment = async (data, currentUser) => {
  if (!data && !currentUser) return "unable to make payment! try again.";

  // Function to dynamically load Razorpay Checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  };

  await loadRazorpayScript();

  const payableAmount =
    data?.bookingPrice?.userPay || data?.bookingPrice?.totalPrice;

  const options = {
    key: import.meta.env.VITE_RAZOR_KEY_ID, // Replace with your Razorpay Test API Key
    amount: payableAmount * 100, // Amount in the smallest currency unit
    currency: "INR",
    order_id: data.bookingId,
    name: "Rento",
    description: "Payment for your purchase",
    handler: function (response) {
      return response;
    },
    prefill: {
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      email: currentUser?.email,
      contact: currentUser?.contact,
    },
    theme: {
      //   color: "#3399cc",
      color: "#e23844",
    },
  };
  if (options) {
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }
};
