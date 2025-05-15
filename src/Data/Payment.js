import axios from "axios";
import favicon from "../assets/favicon.ico";
import {
  handlebooking,
  handlePostData,
  sendEmailForBookingDetails,
  updateCouponCount,
} from ".";
// import { removeTempBookingData } from "../Redux/BookingSlice/BookingSlice";
import { handleUpdateBooking } from "./Functions";

export const razorPayment = async (
  currentUser,
  data,
  orderId,
  result,
  handleAsyncError,
  navigate,
  dispatch,
  handleRestCoupon,
  setBookingLoading
) => {
  if (!data && !currentUser && !orderId && !result)
    return handleAsyncError(
      dispatch,
      "Unable to make payment! Please try again."
    );

  // function to create booking if after payment is completed
  const handleBookVehicle = async (response) => {
    try {
      setBookingLoading && setBookingLoading(true);
      // for booking vehicle
      const updatedData = {
        ...data,
        bookingStatus: "done",
        paymentStatus:
          result?.paymentMethod === "partiallyPay" ? "partially_paid" : "paid",
        paymentMethod: result?.paymentMethod,
        paySuccessId: response?.razorpay_payment_id,
      };

      if (!updatedData)
        return handleAsyncError(
          dispatch,
          "Unable to book ride! if payment got deducted than contact support team."
        );

      // updating booking
      const bookingResponse = await handleUpdateBooking(
        updatedData,
        handlebooking,
        handleAsyncError,
        dispatch
      );

      // deleting temp booking
      // localStorage.removeItem("tempBooking");
      // dispatch(removeTempBookingData());

      if (bookingResponse?.status === 200) {
        const timeLineData = {
          currentBooking_id: bookingResponse?.data?._id,
          timeLine: [
            {
              title: "Payment Done",
              date: Date.now(),
              paymentAmount:
                bookingResponse?.data?.bookingPrice?.discountTotalPrice &&
                bookingResponse?.data?.bookingPrice?.discountTotalPrice > 0
                  ? bookingResponse?.data?.bookingPrice?.discountTotalPrice
                  : bookingResponse?.data?.bookingPrice?.userPaid &&
                    bookingResponse?.data?.bookingPrice?.userPaid > 0
                  ? bookingResponse?.data?.bookingPrice?.userPaid
                  : bookingResponse?.data?.bookingPrice?.totalPrice,
            },
          ],
        };
        await handlePostData("/createTimeline", timeLineData);
        handleAsyncError(dispatch, "Ride booked successfully.", "success");
        navigate(`/account/my-rides/summary/${updatedData?._id}`);
        dispatch(handleRestCoupon());
        // sending booking confirm to whatsapp & email
        sendEmailForBookingDetails(updatedData);
        // checking whether user used the coupon or not if not than return
        if (!updatedData?.discountCuopon?.couponId) return;
        updateCouponCount(updatedData?.discountCuopon?.couponId);
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
    data?.bookingPrice?.userPaid ||
    data?.bookingPrice?.discountTotalPrice ||
    data?.bookingPrice?.totalPrice ||
    100;

  console.log(payableAmount);

  // Razorpay options configuration
  const options = {
    key: import.meta.env.VITE_RAZOR_KEY_ID,
    amount: payableAmount * 100,
    order_id: orderId?.id,
    name: "Rento",
    description: "Payment for your booking",
    image: favicon,
    handler: (response) => {
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
    modal: {
      escape: false,
      ondismiss: () => {
        navigate(`/account/my-rides/summary/${data?._id}`);
        reject({ success: false, message: "Payment cancelled" });
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// for creating order id
export const createOrderId = async (data, finalAmount) => {
  if (!data) return "unable to process payment.";
  const payableAmount = finalAmount
    ? finalAmount
    : data?.bookingPrice?.userPaid ||
      data?.bookingPrice?.discountTotalPrice ||
      data?.bookingPrice?.totalPrice ||
      100;

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
