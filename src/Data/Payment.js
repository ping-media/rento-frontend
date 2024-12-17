import axios from "axios";
import { handleUpdateBooking } from "./Functions";

export const razorPayment = async (
  currentUser,
  data,
  orderId,
  result,
  handleAsyncError,
  navigate,
  removeTempDate,
  handlebooking,
  dispatch
) => {
  if (!data && !currentUser && !orderId)
    return "Unable to make payment! Please try again.";

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

  // console.log(data?._id);

  const updatedata = async (response) => {
    await handleUpdateBooking(
      // e,
      {
        _id: data?.data?._id,
        userId: currentUser?._id,
        userType: currentUser?.userType,
        bookingStatus: "completed",
        paymentStatus: "completed",
        paymentMethod: result?.paymentMethod,
        payInitFrom: `${"Razorpay"}`,
        paySuccessId: response?.razorpay_payment_id,
        paymentgatewayOrderId: orderId,
      },
      removeTempDate,
      handlebooking,
      handleAsyncError,
      dispatch
    );

    handleAsyncError(dispatch, data?.message, "success");
    navigate(`/my-rides/summary/${data?.data?.bookingId}`);
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
    data?.data?.bookingPrice?.userPay ||
    data?.data?.bookingPrice?.totalPrice ||
    100;

  // Razorpay options configuration
  const options = {
    key: import.meta.env.VITE_RAZOR_KEY_ID,
    amount: payableAmount * 100,
    order_id: orderId,
    name: "Rento",
    description: "Payment for your booking",
    handler: (response) => {
      if (response) {
        return updatedata(response);
      }
      // return response;
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
    return "Razorpay key is missing or invalid.";
  }

  // Open Razorpay payment window
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

export const createOrderId = async (data) => {
  if (!data) return "unable to process payment.";
  const payableAmount =
    data?.bookingPrice?.userPay || data?.bookingPrice?.totalPrice || 100;

  const booking_id = data?.booking_id;
  const amount = payableAmount;
  const options = { amount: amount, booking_id: booking_id };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/createOrderId`,
      options
    );

    return response?.data;
  } catch (error) {
    console.error(
      "Error creating Razorpay order:",
      error.response ? error.response.data : error.message
    );
  }
};
