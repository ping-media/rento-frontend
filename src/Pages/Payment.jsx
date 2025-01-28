import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handlePostData } from "../Data";
import { handleAsyncError } from "../utils/handleAsyncError";
import favicon from "../assets/favicon.ico";
import { useDispatch } from "react-redux";

const Payment = () => {
  const [queryParms] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State for showing the white background
  const [paymentDone, setPaymentDone] = useState(false); // State for showing "Payment Done"
  const [paymentInProgress, setPaymentInProgress] = useState(false); // State to prevent reopening payment gateway
  const queryParmsDataUpdated = Object.fromEntries(queryParms.entries());

  // Function to create booking after payment
  const handleBookVehicle = async (response) => {
    try {
      const updatedData = {
        _id: queryParmsDataUpdated?.id,
        bookingStatus: "done",
        paymentStatus: queryParmsDataUpdated?.paymentStatus,
        paymentMethod: "online",
        paySuccessId: response?.razorpay_payment_id,
      };

      // Updating booking
      const bookingResponse = await handlePostData(
        `/createBooking?_id=${queryParmsDataUpdated?.id}`,
        updatedData
      );

      if (bookingResponse?.status === 200) {
        // Update timeline for booking
        const timeLineData = {
          currentBooking_id: queryParmsDataUpdated?.id,
          timeLine: {
            "Payment Done": new Date().toLocaleString(),
          },
        };
        await handlePostData("/createTimeline", timeLineData);

        // Redirect to booking summary
        setPaymentDone(false); // Stop showing "Payment Done"
        navigate(`/my-rides/summary/${bookingResponse?.data?._id}`);
      } else {
        handleAsyncError(dispatch, bookingResponse?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to create booking! Try again.");
    }
  };

  // Function to dynamically load Razorpay Checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to open payment gateway."));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const initializePayment = async () => {
      // Prevent reinitializing the payment gateway
      if (paymentInProgress) return;

      try {
        setPaymentInProgress(true); // Mark payment as in progress

        // Load Razorpay script
        await loadRazorpayScript();

        // Ensure data is valid and extract payment amount
        const payableAmount = queryParmsDataUpdated?.finalAmount || 100;

        // Razorpay options configuration
        const options = {
          key: import.meta.env.VITE_RAZOR_KEY_ID,
          amount: payableAmount * 100,
          order_id: queryParmsDataUpdated?.orderId,
          name: "Rento",
          description: "Payment for your booking",
          image: favicon,
          handler: (response) => {
            if (response) {
              setPaymentDone(true); // Show "Payment Done" after successful payment
              return handleBookVehicle(response);
            } else {
              return handleAsyncError(dispatch, "Payment failed!");
            }
          },
          prefill: {
            name: queryParmsDataUpdated?.fullName,
            email: queryParmsDataUpdated?.email,
            contact: queryParmsDataUpdated?.contact,
          },
          theme: {
            color: "#e23844", // Payment widget color
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        handleAsyncError(dispatch, "Unable to load payment gateway.");
      } finally {
        setLoading(false); // Stop showing white background
      }
    };

    initializePayment();
  }, [queryParmsDataUpdated, dispatch, paymentInProgress]);

  // Render based on the state
  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  if (paymentDone) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <h1 className="text-2xl font-semibold text-green-500">Payment Done!</h1>
      </div>
    );
  }

  return null;
};

export default Payment;
