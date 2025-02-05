import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchingData, handlePostData } from "../Data";
import { handleAsyncError } from "../utils/handleAsyncError";
import favicon from "../assets/favicon.ico";
import { useDispatch } from "react-redux";
import PaymentDoneCard from "../components/ProductCard/PaymentDoneCard";
import PreLoader from "../components/skeleton/PreLoader";

const Payment = () => {
  const [queryParms] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);
  const [bookingFetched, setBookingFetched] = useState(false);
  const paymentInProgress = useRef(false);
  const currentBooking = useRef(null);
  const queryParmsDataUpdated = Object.fromEntries(queryParms.entries());

  const handleBookVehicle = async (response) => {
    try {
      const updatedData = {
        _id: currentBooking.current?._id,
        bookingStatus: queryParmsDataUpdated?.paymentStatus
          ? "done"
          : "extended",
        paymentStatus:
          queryParmsDataUpdated?.paymentStatus ||
          currentBooking.current?.paymentStatus,
        paymentMethod: "online",
        paymentgatewayOrderId:
          queryParmsDataUpdated?.order ||
          currentBooking.current?.paymentgatewayOrderId,
        paySuccessId: response?.razorpay_payment_id,
        extendBooking: {
          oldBooking: currentBooking.current?.oldBooking,
          transactionIds: [
            ...(currentBooking.current?.extendBooking?.transactionIds || []),
            currentBooking.current?.paymentgatewayOrderId,
            currentBooking.current?.paySuccessId,
          ],
        },
      };

      const bookingResponse = await handlePostData(
        `/createBooking?_id=${queryParmsDataUpdated?.id}`,
        updatedData
      );

      if (bookingResponse?.status === 200) {
        const timeLineData = {
          currentBooking_id: queryParmsDataUpdated?.id,
          timeLine: [
            {
              title: "Payment Received",
              date: new Date().toLocaleString(),
              paymentAmount: queryParmsDataUpdated?.finalAmount,
            },
          ],
        };
        await handlePostData("/createTimeline", timeLineData);
        setPaymentDone(false);
        navigate("/");
      } else {
        handleAsyncError(dispatch, bookingResponse?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    }
  };

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

  // Fetch booking data first
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const getBookingData = await fetchingData(
          `/getBookings?_id=${queryParmsDataUpdated?.id}`
        );
        if (getBookingData?.status === 200) {
          currentBooking.current = getBookingData?.data[0];
          setBookingFetched(true); // Mark as fetched
          if (queryParmsDataUpdated?.order) {
            if (
              currentBooking.current?.paymentgatewayOrderId ===
              queryParmsDataUpdated?.order
            ) {
              handleAsyncError(dispatch, "Payment Already Done!", "success");
              return navigate("/");
            }
          }
        } else {
          handleAsyncError(dispatch, getBookingData?.message);
          navigate("/");
        }
      } catch (error) {
        handleAsyncError(dispatch, "Error fetching booking data");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [queryParmsDataUpdated, dispatch, navigate]);

  // After fetching data, initialize payment
  useEffect(() => {
    if (!bookingFetched || paymentInProgress.current) return;
    paymentInProgress.current = true;

    const initializePayment = async () => {
      try {
        await loadRazorpayScript();
        const payableAmount = queryParmsDataUpdated?.finalAmount || 100;

        const options = {
          key: import.meta.env.VITE_RAZOR_KEY_ID,
          amount: payableAmount * 100,
          order_id: queryParmsDataUpdated?.order,
          name: "Rento",
          description: "Payment for your booking",
          image: favicon,
          handler: (response) => {
            if (response) {
              setPaymentDone(true);
              return handleBookVehicle(response);
            } else {
              return handleAsyncError(dispatch, "Payment failed!");
            }
          },
          prefill: {
            name: `${currentBooking.current?.userId?.firstName} ${currentBooking.current?.userId?.lastName}`,
            email: currentBooking.current?.userId?.email,
            contact: currentBooking.current?.userId?.contact,
          },
          theme: { color: "#e23844" },
          modal: {
            escape: false,
            ondismiss: function () {
              navigate("/");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        handleAsyncError(dispatch, "Unable to load payment gateway.");
        navigate("/");
      }
    };

    initializePayment();
  }, [bookingFetched, queryParmsDataUpdated, dispatch, navigate]);

  if (loading) {
    return (
      <div className="bg-white h-screen">
        <PreLoader />
      </div>
    );
  }

  if (paymentDone) {
    return (
      <div className="flex items-center justify-center">
        <PaymentDoneCard />
      </div>
    );
  }

  return null;
};

export default Payment;
