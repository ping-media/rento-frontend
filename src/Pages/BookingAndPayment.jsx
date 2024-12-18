import { useDispatch, useSelector } from "react-redux";
import PreLoader from "../components/skeleton/PreLoader";
// import { formatDateTimeForUser, formatPrice } from "../utils";
import { handleCreateBooking, handleUpdateBooking } from "../Data/Functions";
import BookingInfoCard from "../components/ProductCard/BookingInfoCard";
import BookingPriceCard from "../components/ProductCard/BookingPriceCard";
import BookingPaymentCard from "../components/ProductCard/BookingPaymentCard";
import BookingTermCard from "../components/ProductCard/BookingTermCard";
import { useState } from "react";
import { handleAsyncError } from "../utils/handleAsyncError";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner/Spinner";
import { removeTempDate } from "../Redux/ProductSlice/ProductsSlice";
import { handlebooking } from "../Data";
import { createOrderId, razorPayment } from "../Data/Payment";

const BookingAndPayment = () => {
  const { tempBookingData } = useSelector((state) => state.booking);
  const { currentUser } = useSelector((state) => state.user);
  const [bookingLoading, setBookingLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // for creating booking
  const handleCreateBookingSubmit = async (e) => {
    try {
      setBookingLoading(true);
      e.preventDefault();

      let data = tempBookingData;

      const response = new FormData(e.target);
      const result = Object.fromEntries(response.entries());
      if (!result?.paymentMethod) {
        setBookingLoading(false);
        return handleAsyncError(dispatch, "select payment method first!");
      } else if (result?.paymentMethod == "partiallyPay") {
        // if user select to pay some amount then this will run
        data = {
          ...data,
          bookingPrice: {
            ...data.bookingPrice,
            userPaid: parseInt(
              (tempBookingData?.bookingPrice?.totalPrice * 20) / 100
            ),
          },
        };
      }
      // pushing payment method
      data = { ...data, paymentMethod: result?.paymentMethod };

      if (
        result?.paymentMethod == "online" ||
        result?.paymentMethod == "partiallyPay"
      ) {
        const orderId = await createOrderId(data);

        data = {
          ...data,
          payInitFrom: "Razorpay",
          paymentgatewayOrderId: orderId?.id,
          paymentgatewayReceiptId: orderId?.receipt,
        };

        // if orderId is created successfully than send it to payment gateway
        return await razorPayment(
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
        );
      } else if (result?.paymentMethod == "cash") {
        data = {
          ...data,
          bookingStatus: "completed",
          paymentStatus: "pending",
          paymentMethod: result?.paymentMethod,
          payInitFrom: "cash",
          paySuccessId: "NA",
          paymentgatewayOrderId: "NA",
        };
        // for booking vehicle
        const bookingResponse = await handleCreateBooking(
          data,
          handlebooking,
          removeTempDate,
          handleAsyncError,
          dispatch
        );
        if (bookingResponse?.status == 200) {
          handleAsyncError(dispatch, bookingResponse?.message, "success");
          navigate(`/my-rides/summary/${bookingResponse?.data?.bookingId}`);
        } else {
          handleAsyncError(dispatch, "unable to make booking! try again");
        }
      } else {
        handleAsyncError(dispatch, "please select payment option first");
      }
    } catch (error) {
      console.log(error?.message);
      return handleAsyncError(
        dispatch,
        "something went wrong while booking ride"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return tempBookingData ? (
    <div className="w-[90%] mx-auto my-5 lg:my:3 xl:my-4">
      <form onSubmit={handleCreateBookingSubmit}>
        <div className="flex flex-wrap lg:grid lg:grid-cols-10 lg:gap-4">
          <div className="col-span-7">
            <div className="mb-3 border-2 border-gray-300 rounded-lg py-2 px-2 lg:px-4 bg-white shadow-md order-1">
              <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
                <h2 className="font-semibold">Booking Summary</h2>
                <h2 className="font-semibold hidden lg:block">Price</h2>
              </div>
              <BookingInfoCard {...tempBookingData} />
            </div>
            <BookingTermCard />
          </div>

          <div className="flex flex-wrap col-span-3">
            <div className="mb-3 border-2 bg-white border-gray-300 shadow-md rounded-lg py-2 px-4 relative order-2 w-full relative">
              <div className="py-3 border-b-2 border-gray-300">
                <h2 className="font-semibold">Total Price</h2>
              </div>
              <BookingPriceCard
                bookingPrice={tempBookingData && tempBookingData?.bookingPrice}
                BookingStartDateAndTime={
                  tempBookingData && tempBookingData?.BookingStartDateAndTime
                }
                BookingEndDateAndTime={
                  tempBookingData && tempBookingData?.BookingEndDateAndTime
                }
              />
            </div>
            <div className="mb-3 border-2 border-gray-300 rounded-lg py-2 px-4 bg-white shadow-md order-3 flex flex-col items-center justify-center w-full">
              <div className="py-3 border-b-2 border-gray-300 w-full">
                <h2 className="font-semibold">Payment Method</h2>
              </div>
              <BookingPaymentCard />
            </div>
            <div className="mt-1 order-5 w-full">
              <button
                className="bg-theme px-4 py-4 w-full text-gray-100 rounded-lg disabled:bg-gray-400"
                disabled={bookingLoading}
                type="submit"
              >
                {!bookingLoading ? (
                  "Make Payment"
                ) : (
                  <Spinner message={"booking..."} />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <PreLoader />
  );
};

export default BookingAndPayment;
