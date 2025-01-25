import { useNavigate, useSearchParams } from "react-router-dom";
import { handlePostData } from "../Data";
import { handleAsyncError } from "../utils/handleAsyncError";
import { useDispatch } from "react-redux";

const Payment = async () => {
  const [queryParms] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryParmsDataUpdated = Object.fromEntries(queryParms.entries());

  // function to create booking if after payment is completed
  const handleBookVehicle = async (response) => {
    try {
      // for booking vehicle
      const updatedData = {
        _id: queryParmsDataUpdated?.bookingId,
        bookingStatus: "done",
        paymentStatus: queryParmsDataUpdated?.paymentStatus,
        paymentMethod: "online",
        paySuccessId: response?.razorpay_payment_id,
      };

      // updating booking
      const bookingResponse = await handlePostData(
        `/createBooking?_id=${queryParmsDataUpdated?.id}`,
        updatedData
      );
      if (bookingResponse?.status == 200) {
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: response?.data?._id,
          timeLine: {
            "Payment Initiated": new Date().toLocaleString(),
          },
        };
        handlePostData("/createTimeline", timeLineData);
        navigate(`/my-rides/summary/${updatedData?._id}`);
      } else {
        handleAsyncError(dispatch, bookingResponse?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "unable to create booking! try again");
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
      // console.log(response);
      if (response) {
        return handleBookVehicle(response);
      } else {
        handleAsyncError(dispatch, "payment failed!");
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
};

export default Payment;
