import axios from "axios";
import favicon from "../../public/favicon.ico";

export const razorPayment = async (
  currentUser,
  data,
  orderId,
  result,
  handleCreateBooking,
  handleAsyncError,
  navigate,
  removeTempDate,
  handlebooking,
  dispatch,
  setBookingLoading
) => {
  if (!data && !currentUser && !orderId && !result)
    return "Unable to make payment! Please try again.";

  // function to create booking if after payment is completed
  const handleBookVehicle = async (response) => {
    // for booking vehicle
    const updatedData = {
      ...data,
      bookingStatus: "completed",
      paymentStatus: "completed",
      paymentMethod: result?.paymentMethod,
      paySuccessId: response?.razorpay_payment_id,
    };

    const bookingResponse = await handleCreateBooking(
      updatedData,
      handlebooking,
      removeTempDate,
      handleAsyncError,
      dispatch
    );

    if (bookingResponse?.status == 200) {
      handleAsyncError(dispatch, bookingResponse?.message, "success");
      navigate(`/my-rides/summary/${bookingResponse?.data?.bookingId}`);
    } else {
      handleAsyncError(dispatch, bookingResponse?.message);
    }

    setBookingLoading && setBookingLoading(false);
  };

  setBookingLoading && setBookingLoading(true);

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

  await loadRazorpayScript();

  // Ensure data is valid and extract payment amount
  const payableAmount =
    data?.bookingPrice?.userPaid || data?.bookingPrice?.totalPrice || 100;

  // Razorpay options configuration
  const options = {
    key: import.meta.env.VITE_RAZOR_KEY_ID,
    amount: payableAmount * 100,
    order_id: orderId?.id,
    name: "Rento",
    description: "Payment for your booking",
    image: favicon,
    handler: (response) => {
      // console.log(response);
      if (response) {
        handleBookVehicle(response);
      } else {
        handleAsyncError(dispatch, "payment failed!");
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

  if (!options.key) {
    return "Razorpay key is missing or invalid.";
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// for creating order id
export const createOrderId = async (data) => {
  if (!data) return "unable to process payment.";
  const payableAmount =
    data?.bookingPrice?.userPaid || data?.bookingPrice?.totalPrice || 100;

  const amount = payableAmount;
  const options = { amount: amount };

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
