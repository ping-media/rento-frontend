import { handleAsyncError } from "./handleAsyncError";
import favicon from "../assets/favicon.ico";
import { handlePostData } from "../Data";

export const openRazorpayPayment = ({
  finalAmount,
  orderId,
  bookingData,
  dispatch,
  navigate,
  type = "",
  typeId = "",
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

    const deleteBooking = async () => {
      try {
        const payload = {
          bookingId: bookingData._id,
          userId: bookingData.userId?._id || bookingData.userId,
        };

        if (type === "extend" && typeId !== "") {
          payload.type = "extend";
          payload.typeId = typeId || 0;
        }

        await handlePostData("/delete-booking", payload);
        console.log("Booking deleted due to payment cancel");
      } catch (err) {
        console.error("Error deleting booking on cancel:", err);
      }
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
          name: `${bookingData?.firstName || bookingData?.userId?.firstName} ${
            bookingData?.lastName || bookingData?.userId?.lastName
          }`,
          email: bookingData?.email || bookingData?.userId?.email,
          contact: bookingData?.contact || bookingData?.userId?.contact,
        },
        theme: { color: "#DE2A1B" },
        modal: {
          escape: false,
          ondismiss: async () => {
            await deleteBooking();
            if (
              navigate &&
              !location.pathname.includes("/account/my-rides/summary/")
            )
              navigate("/");
            reject({ success: false, message: "Payment cancelled" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      await deleteBooking();
      handleAsyncError(dispatch, error.message || "Unable to load Razorpay.");
      if (navigate) navigate("/");
      reject(error);
    }
  });
};
