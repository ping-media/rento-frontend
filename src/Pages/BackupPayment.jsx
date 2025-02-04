// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { fetchingData, handlePostData } from "../Data";
// import { handleAsyncError } from "../utils/handleAsyncError";
// import favicon from "../assets/favicon.ico";
// import { useDispatch } from "react-redux";
// import PaymentDoneCard from "../components/ProductCard/PaymentDoneCard";
// import PreLoader from "../components/skeleton/PreLoader";

// const Payment = () => {
//   const [queryParms] = useSearchParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [paymentDone, setPaymentDone] = useState(false);
//   const paymentInProgress = useRef(false); // Use useRef instead of useState
//   const queryParmsDataUpdated = Object.fromEntries(queryParms.entries());

//   let currentBooking;

//   const handleBookVehicle = async (response) => {
//     try {
//       const updatedData = {
//         _id: currentBooking?._id,
//         bookingStatus: queryParmsDataUpdated?.paymentStatus
//           ? "done"
//           : "extended",
//         paymentStatus:
//           queryParmsDataUpdated?.paymentStatus || currentBooking?.paymentStatus,
//         paymentMethod: "online",
//         paymentgatewayOrderId:
//           queryParmsDataUpdated?.order || currentBooking?.paymentgatewayOrderId,
//         paySuccessId: response?.razorpay_payment_id,
//         extendBooking: {
//           oldBooking: currentBooking?.oldBooking,
//           transactionIds: [
//             ...currentBooking?.extendBooking?.transactionIds,
//             currentBooking?.paySuccessId,
//           ],
//         },
//       };

//       const bookingResponse = await handlePostData(
//         `/createBooking?_id=${queryParmsDataUpdated?.id}`,
//         updatedData
//       );

//       if (bookingResponse?.status === 200) {
//         const timeLineData = {
//           currentBooking_id: queryParmsDataUpdated?.id,
//           timeLine: [
//             {
//               title: "Payment Recived",
//               date: new Date().toLocaleString(),
//               paymentAmount: queryParmsDataUpdated?.finalAmount,
//             },
//           ],
//         };
//         await handlePostData("/createTimeline", timeLineData);
//         setPaymentDone(false);
//         navigate("/");
//       } else {
//         handleAsyncError(dispatch, bookingResponse?.message);
//       }
//     } catch (error) {
//       handleAsyncError(dispatch, error?.message);
//     }
//   };

//   const loadRazorpayScript = () => {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve();
//       script.onerror = () =>
//         reject(new Error("Failed to open payment gateway."));
//       document.body.appendChild(script);
//     });
//   };

//   useEffect(() => {
//     const initializePayment = async () => {
//       if (paymentInProgress.current) return; // Prevent multiple executions
//       paymentInProgress.current = true; // Mark as in progress

//       const getBookingData = await fetchingData(
//         `/getBookings?_id=${queryParmsDataUpdated?.id}`
//       );
//       if (getBookingData?.status === 200) {
//         currentBooking = getBookingData?.data[0];
//       } else {
//         handleAsyncError(dispatch, getBookingData?.message);
//         navigate("/");
//       }

//       try {
//         await loadRazorpayScript();
//         const payableAmount = queryParmsDataUpdated?.finalAmount || 100;

//         const options = {
//           key: import.meta.env.VITE_RAZOR_KEY_ID,
//           amount: payableAmount * 100,
//           order_id: queryParmsDataUpdated?.order,
//           name: "Rento",
//           description: "Payment for your booking",
//           image: favicon,
//           handler: (response) => {
//             if (response) {
//               setPaymentDone(true);
//               return handleBookVehicle(response);
//             } else {
//               return handleAsyncError(dispatch, "Payment failed!");
//             }
//           },
//           prefill: {
//             name: `${currentBooking?.userId?.firstName} ${currentBooking?.userId?.lastName}`,
//             email: currentBooking?.userId?.email,
//             contact: currentBooking?.userId?.contact,
//           },
//           theme: { color: "#e23844" },
//           modal: {
//             escape: false, // Prevents closing on `Esc` key
//             ondismiss: function () {
//               navigate("/"); // Redirect to home if the user closes Razorpay modal
//             },
//           },
//         };

//         const razorpay = new window.Razorpay(options);
//         razorpay.open();
//       } catch (error) {
//         handleAsyncError(dispatch, "Unable to load payment gateway.");
//         navigate("/");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializePayment();
//   }, [queryParmsDataUpdated]);

//   if (loading) {
//     return (
//       <div className="bg-white h-screen">
//         <PreLoader />
//       </div>
//     );
//   }

//   if (paymentDone) {
//     return (
//       <div className="flex items-center justify-center">
//         <PaymentDoneCard />
//       </div>
//     );
//   }

//   return null;
// };

// export default Payment;
