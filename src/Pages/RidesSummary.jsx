import { useNavigate, useParams } from "react-router-dom";
import { formatDateTimeISTForUser } from "../utils";
import RideCard from "../components/Account/RideCard";
import LocationCard from "../components/ProductCard/LocationCard";
import { lazy, useEffect, useState } from "react";
import {
  addRidesData,
  fetchingRides,
  removeRidesData,
} from "../Redux/RidesSlice/RideSlice";
import { fetchingData } from "../Data";
import { useDispatch, useSelector } from "react-redux";
import PreLoader from "../components/skeleton/PreLoader";
import RideFareDetails from "../components/ProductCard/RideFareDetails";
import ThingsToRemember from "../components/ProductCard/ThingsToRemember";
import BookingError from "../components/Error/BookingError";
import PickupImages from "../components/Account/PickupImages";
import { handleAsyncError } from "../utils/handleAsyncError";
import Spinner from "../components/Spinner/Spinner";
import ExtendBookingButton from "../components/Account/ExtendBookingButton";
import { openRazorpayPayment } from "../utils/razorpay";
import { pollBookingStatus } from "../Data/Functions";
const ExtendBookingModal = lazy(() =>
  import("../components/Modals/ExtendBookingModal")
);

const RidesSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [formatedDateAndTime, setFormatedDateAndTime] = useState(null);
  const [stationLoading, setStationLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [images, setImages] = useState([]);
  const { rides, loading } = useSelector((state) => state.rides);

  // fetching booking data using booking id
  useEffect(() => {
    if (id) {
      (async () => {
        dispatch(fetchingRides());
        const result = await fetchingData(`/getBookings?_id=${id}`);
        dispatch(addRidesData(result?.data));
        if (result?.status !== 200) return;
        const response = await fetchingData(
          `/getPickupImage?bookingId=${result?.data[0]?.bookingId}`
        );
        if (response?.status === 200) {
          setImages(response?.data);
        }
        // formatting data for user readability
        setFormatedDateAndTime(
          formatDateTimeISTForUser(result?.data[0]?.createdAt)
        );
      })();
    }

    return () => {
      dispatch(removeRidesData());
    };
  }, []);

  // back button to let them go back to ride page
  const handleBackToRides = () => {
    navigate("/account/my-rides");
  };

  // for making payment
  const handleMakePayment = async () => {
    const { _id, paymentgatewayOrderId, bookingPrice } = rides[0];
    // checking whether user applied Discount or not
    const subAmount =
      bookingPrice?.discountTotalPrice && bookingPrice?.discountTotalPrice > 0
        ? bookingPrice?.discountTotalPrice
        : bookingPrice?.totalPrice;
    // checking whether user is paying full payment or half
    const finalAmount =
      bookingPrice?.userPaid && bookingPrice?.userPaid > 0
        ? bookingPrice?.userPaid
        : subAmount;
    // setting paymentStatus
    // const paymentStatus =
    //   bookingPrice?.userPaid && bookingPrice?.userPaid > 0
    //     ? "partiallyPay"
    //     : "paid";

    try {
      setPaymentLoading(true);
      let orderId = paymentgatewayOrderId;
      const paymentSuccess = await openRazorpayPayment({
        finalAmount: finalAmount,
        orderId: orderId,
        bookingData: rides[0],
        dispatch,
        navigate,
      });

      if (paymentSuccess) {
        const confirmed = await pollBookingStatus(_id);
        if (confirmed) {
          setBookingLoading(false);
          handleAsyncError(
            dispatch,
            "Ride payment updated successfully",
            "success"
          );
          return;
        }
      }
    } catch (error) {
      return handleAsyncError(dispatch, "Unable to make payment! try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      {loading && <PreLoader />}
      <ExtendBookingModal />
      {rides?.length == 1 ? (
        <div className="border-2 rounded-lg p-2 lg:px-4 lg:py-2 shadow-md bg-white mb-3">
          <div className="mb-1 flex items-center gap-3">
            <button
              className="flex lg:hidden items-center gap-1 p-1.5 rounded-lg outline-none hover:bg-theme hover:text-gray-100"
              type="button"
              onClick={handleBackToRides}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H6M12 5l-7 7 7 7" />
              </svg>
            </button>
            <h2 className="font-bold text-lg lg:text-xl uppercase py-2">
              Booking <span className="text-theme">Information</span>
            </h2>
          </div>
          <div className="px-2 py-3.5 -mx-4 lg:-mx-4 bg-gray-400/20 flex flex-wrap gap-2 items-center justify-between mb-5 text-sm">
            <div className="flex items-center">
              <p className="font-semibold w-full lg:w-auto text-gray-600">
                <span className="block lg:inline">
                  Booking Id: #{rides[0]?.bookingId}
                </span>
                <span className="mx-1 hidden lg:inline">|</span>
                Booking Date & Time: {formatedDateAndTime?.date} :{" "}
                {formatedDateAndTime?.time}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {rides[0]?.bookingStatus == "pending" && (
                <button
                  className="p-1.5 md:px-4 lg:px-6 lg:py-2.5 bg-theme/90 shadow-md text-white outline-none rounded-md capitalize disabled:bg-opacity-50"
                  type="button"
                  onClick={handleMakePayment}
                  disabled={paymentLoading}
                >
                  {!paymentLoading ? "make payment" : <Spinner />}
                </button>
              )}
              <div
                className={`bg-theme hover:bg-opacity-80 text-gray-100 p-1.5 md:px-4 lg:px-6 lg:py-2.5 shadow-md outline-none border-0 rounded-md cursor-pointer`}
              >
                Booking Status:{" "}
                <span className="uppercase">{rides[0]?.bookingStatus}</span>
              </div>
            </div>
          </div>
          <div className="lg:overflow-hidden lg:hover:overflow-y-auto no-scrollbar">
            <div className="mb-5">
              <div className="flex justify-between items-center mt-1 mb-3">
                <h2 className="font-semibold flex items-center gap-1">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                  </span>
                  Vehicle Details
                </h2>
                <p className="text-md text-semibold">
                  <span className="hidden lg:inline">Ride Status:</span>
                  <span
                    className={`border-2 border-gray-300 bg-gray-200 bg-opacity-50 text-black px-2 py-1 rounded-md cursor-pointer uppercase ml-2`}
                  >
                    {rides[0]?.rideStatus === "pending"
                      ? "Not Started"
                      : rides[0]?.rideStatus === "ongoing"
                      ? "Started"
                      : rides[0]?.rideStatus === "canceled"
                      ? "Canceled"
                      : "Completed"}
                  </span>
                </p>
              </div>
              <RideCard
                item={rides[0]}
                formatedDateAndTime={formatedDateAndTime}
                id={id}
              />
            </div>
            <div className="mb-5">
              <h2 className="font-semibold mb-3 flex items-center gap-1">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                  </svg>
                </span>
                Station Details
              </h2>
              <LocationCard
                stationName={rides[0]?.stationName}
                stationId={rides[0]?.stationId}
                stationMasterUserId={rides[0]?.stationMasterUserId}
                stationData={rides[0]?.stationData}
                setStationLoading={setStationLoading}
                stationLoading={stationLoading}
              />
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold flex items-center gap-1">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                      />
                    </svg>
                  </span>
                  Fare Details
                </h2>
                <p className="text-md text-semibold">
                  <span className="hidden lg:inline">Payment Mode:</span>
                  <span
                    className={`${
                      (rides[0]?.paymentStatus === "partially_paid" &&
                        "bg-orange-400") ||
                      (rides[0]?.paymentStatus === "partiallyPay" &&
                        "bg-orange-400") ||
                      (rides[0]?.paymentStatus === "pending" && "bg-theme") ||
                      rides[0]?.paymentStatus === "pending" ||
                      (rides[0]?.paymentStatus === "failed" && "bg-theme") ||
                      (rides[0]?.paymentStatus === "refunded" && "bg-theme") ||
                      (rides[0]?.paymentStatus === "canceled" && "bg-theme") ||
                      (rides[0]?.paymentStatus === "paid" &&
                        "bg-green-500 bg-opacity-80")
                    } text-white px-2.5 py-1 rounded-md cursor-pointer capitalize ml-2`}
                  >
                    {rides[0]?.paymentStatus.replace("_", " ")}
                  </span>
                </p>
              </div>
              <div className="px-4 py-2 rounded-lg border-2 flex flex-wrap gap-4 mb-3">
                <RideFareDetails rides={rides && rides[0]} />
              </div>
            </div>
            <div className="mb-5">
              <ExtendBookingButton />
            </div>
            <div className="mb-5">
              <h2 className="font-semibold mb-3 flex items-center gap-1">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </span>
                Things To Remember
              </h2>
              <div className="px-2 lg:px-4 py-2 rounded-lg border-2 flex flex-wrap gap-4 mb-3 bg-gray-400 bg-opacity-20">
                <ThingsToRemember rides={rides && rides[0]} />
              </div>
              {/* for showing pickup images  */}
              <div className="mb-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-1">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </span>
                    Pickup Vehicle Images
                  </h2>
                </div>
              </div>
              <div className="px-2 lg:px-4 py-2 rounded-lg border-2 flex flex-wrap gap-4 mb-3">
                {images && images?.length > 0 ? (
                  <PickupImages data={images} />
                ) : (
                  <p className="w-full text-gray-400 italic text-center">
                    No images to display.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white mb-3">
          {!loading && <BookingError />}
        </div>
      )}
    </>
  );
};

export default RidesSummary;
