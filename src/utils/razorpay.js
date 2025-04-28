import { handleAsyncError } from "./handleAsyncError";
import favicon from "../assets/favicon.ico";

export const openRazorpayPayment = ({
  finalAmount,
  orderId,
  bookingData,
  dispatch,
  navigate,
}) => {
  return new Promise(async (resolve, reject) => {
    if (!finalAmount || !orderId || !bookingData) {
      handleAsyncError(dispatch, "Missing payment details");
      return;
    }

    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });
    };

    try {
      await loadRazorpayScript();

      const options = {
        key: import.meta.env.VITE_RAZOR_KEY_ID,
        amount: Number(finalAmount) * 100,
        currency: "INR",
        order_id: orderId,
        name: "Rento",
        description: "Payment for your booking",
        image: favicon,
        handler: (response) => {
          if (response) {
            return resolve({ success: true, response });
          } else {
            handleAsyncError(dispatch, "Payment failed!");
            return reject({ success: false, message: "Payment failed" });
          }
        },
        prefill: {
          name: `${bookingData?.userId?.firstName} ${bookingData?.userId?.lastName}`,
          email: bookingData?.userId?.email,
          contact: bookingData?.userId?.contact,
        },
        theme: { color: "#e23844" },
        modal: {
          escape: false,
          ondismiss: () => {
            if (navigate) navigate("/");
            reject({ success: false, message: "Payment cancelled" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      handleAsyncError(dispatch, error.message || "Unable to load Razorpay.");
      if (navigate) navigate("/");
      reject(error);
    }
  });
};
