import axios from "axios";
import favicon from "../assets/favicon.ico";
import { sendConfirmBookingToNumber } from ".";

export const razorPayment = async (
  currentUser,
  data,
  orderId,
  result,
  handleUpdateBooking,
  handleAsyncError,
  navigate,
  handlebooking,
  dispatch,
  setBookingLoading
) => {
  if (!data && !currentUser && !orderId && !result)
    return "Unable to make payment! Please try again.";

  // function to create booking if after payment is completed
  const handleBookVehicle = async (response) => {
    try {
      setBookingLoading && setBookingLoading(true);
      // for booking vehicle
      const updatedData = {
        ...data,
        bookingStatus: "done",
        paymentStatus:
          result?.paymentMethod == "partiallyPay" ? "partially_paid" : "paid",
        paymentMethod: result?.paymentMethod,
        paySuccessId: response?.razorpay_payment_id,
      };

      // updating booking
      const bookingResponse = await handleUpdateBooking(
        updatedData,
        handlebooking,
        handleAsyncError,
        dispatch
      );

      // deleting temp booking
      localStorage.removeItem("tempBooking");

      if (bookingResponse?.status == 200) {
        handleAsyncError(dispatch, "Ride booked successfully.", "success");
        navigate(`/my-rides/summary/${updatedData?.bookingId}`);
        sendConfirmBookingToNumber(updatedData);
      } else {
        handleAsyncError(dispatch, bookingResponse?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "unable to create booking! try again");
    } finally {
      setBookingLoading && setBookingLoading(false);
    }
  };

  // Function to dynamically load Razorpay Checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = (error) =>
        reject(new Error("Failed to open payment gateway."));
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
        return handleBookVehicle(response);
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

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// for creating order id
export const createOrderId = async (data) => {
  if (!data) return "unable to process payment.";
  const payableAmount =
    data?.bookingPrice?.userPaid || data?.bookingPrice?.totalPrice || 100;

  const amount = payableAmount;
  const options = { amount: amount, booking_id: data?.bookingId };

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
