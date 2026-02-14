import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchingData } from "../Data";
import { handleAsyncError } from "../utils/handleAsyncError";
import { useDispatch } from "react-redux";
import PaymentDoneCard from "../components/ProductCard/PaymentDoneCard";
import PreLoader from "../components/skeleton/PreLoader";
import { jwtDecode } from "jwt-decode";

const Payment = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);
  const [bookingFetched, setBookingFetched] = useState(false);
  const paymentInProgress = useRef(false);
  const currentBooking = useRef(null);
  const [decodedParams, setDecodedParams] = useState(null);

  // decoding the jwt token
  useEffect(() => {
    if (id) {
      const decodedData = jwtDecode(id);
      setDecodedParams(decodedData);
      sessionStorage.setItem("paymentParams", JSON.stringify(decodedData));
    }
  }, [id]);

  useEffect(() => {
    if (!decodedParams) {
      const storedParams = sessionStorage.getItem("paymentParams");
      if (storedParams) {
        setDecodedParams(JSON.parse(storedParams));
      }
    }
  }, []);

  // Fetch booking data first
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const getBookingData = await fetchingData(
          `/getBookings?_id=${decodedParams?.id}`,
        );
        if (getBookingData?.status === 200) {
          currentBooking.current = getBookingData?.data[0];
          setBookingFetched(true);
          if (decodedParams?.order) {
            if (
              currentBooking.current?.paymentgatewayOrderId ===
              decodedParams?.order
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

    decodedParams !== null && fetchBookingData();
  }, [decodedParams, dispatch, navigate]);

  // After fetching data, initialize payment
  useEffect(() => {
    (async () => {
      if (!bookingFetched || paymentInProgress.current) return;

      const alreadyPaid = sessionStorage.getItem("paymentStarted");
      if (alreadyPaid) return;

      paymentInProgress.current = true;

      sessionStorage.setItem("paymentStarted", "true");

      const paymentSuccess = await openRazorpayPayment({
        finalAmount: decodedParams?.finalAmount || 100,
        orderId: decodedParams?.order,
        bookingData: currentBooking?.current,
        dispatch,
        navigate,
      });

      if (paymentSuccess) {
        sessionStorage.removeItem("paymentStarted");
      } else {
        return handleAsyncError(dispatch, "Payment failed!");
      }
    })();
  }, [bookingFetched, decodedParams, dispatch, navigate]);

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
