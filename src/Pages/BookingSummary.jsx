import { lazy, useEffect, useRef, useState } from "react";
import Checkbox from "../components/Input/CheckBox";
import DetailsCard from "../components/ProductCard/DetailsCard";
import InfoCard from "../components/ProductCard/InfoCard";
import PriceCard from "../components/ProductCard/PriceCard";
import PromoCard from "../components/ProductCard/PromoCard";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummarySkeleton from "../components/skeleton/SummarySkeleton";
import { toggleLoginModal } from "../Redux/ModalSlice/ModalSlice";
import { handleBooking } from "../Data/Functions";
import Spinner from "../components/Spinner/Spinner";
import BookingPaymentCard from "../components/ProductCard/BookingPaymentCard";
import BookingTermModal from "../components/Modals/BookingTermModal";
import { handleAsyncError } from "../utils/handleAsyncError";
import {
  formatDateTimeForUser,
  handlePreviousPage,
  validateBookingDates,
} from "../utils";
import { handleSelectedAddOn } from "../Redux/AddOnSlice/AddOnSlice";
import { useVehicleData } from "../hooks/useBookingSummary";
const BookingError = lazy(() => import("../components/Error/BookingError"));
const CouponModal = lazy(() => import("../components/Modals/SuccessModal"));

const BookingSummary = () => {
  const termsRef = useRef(null);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isAllFieldChecked, setIsAllFieldChecked] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, vehicles } = useSelector((state) => state.vehicles);
  const { selectedStation } = useSelector((state) => state.station);
  const { selectedAddOn } = useSelector((state) => state.addon);
  const { tempCouponName, tempCouponId, isDiscountZero } = useSelector(
    (state) => state.coupon
  );
  const [bookingLoading, setBookingLoading] = useState(false);
  // for getting queryparms value
  const [queryParms] = useSearchParams();
  const [queryParmsData] = useState(Object.fromEntries(queryParms.entries()));
  // for vehicle Data
  const { vehiclePlanData } = useVehicleData(id, queryParmsData);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const bookingStartDateTime =
    queryParmsData?.BookingStartDateAndTime &&
    formatDateTimeForUser(queryParmsData?.BookingStartDateAndTime);
  const bookingEndDateTime =
    queryParmsData?.BookingEndDateAndTime &&
    formatDateTimeForUser(queryParmsData?.BookingEndDateAndTime);

  // if extra addon is selected than this will run
  useEffect(() => {
    if (isTermsChecked) {
      setIsAllFieldChecked(!isAllFieldChecked);
    } else if (isAllFieldChecked) {
      setIsAllFieldChecked(!isAllFieldChecked);
    }
  }, [isTermsChecked]);

  // for clearing addon when user leave the page
  useEffect(() => {
    return () => {
      dispatch(handleSelectedAddOn([]));
    };
  }, []);

  const convertHourTo24HourTime = (hour) => {
    const h = parseInt(hour, 10);
    if (isNaN(h) || h < 0 || h > 23) {
      return "00:00:00Z";
    }
    const paddedHour = h.toString().padStart(2, "0");
    return `${paddedHour}:00:00Z`;
  };

  const getCurrentLocalTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const validateTimes = (
    enteredStartTime,
    enteredEndTime,
    openTime,
    closeTime,
    currentTime
  ) => {
    const stripZ = (t) => t.replace("Z", "");

    const startTime = stripZ(enteredStartTime.split("T")[1]);
    const endTime = stripZ(enteredEndTime.split("T")[1]);
    const open = stripZ(openTime);
    const close = stripZ(closeTime);
    const now = stripZ(currentTime);

    // Check if start and end time are within open-close range
    const isWithinStationHours = startTime >= open && endTime <= close;
    const isStationOpen = now >= open && now <= close;

    if (!isWithinStationHours) {
      return {
        valid: false,
        message: "Booking time must be within station working hours.",
      };
    }
    // Check if start time is before current time (not allowed)
    if (isStationOpen && startTime < now) {
      return {
        valid: false,
        message: "Booking start time cannot be in the past.",
      };
    }

    return {
      valid: true,
      message: "Booking time is valid.",
    };
  };

  // for send to detail and payment page
  const handleCreateBookingSubmit = (e) => {
    e.preventDefault();
    const queryParmsDataUpdated = Object.fromEntries(queryParms.entries());
    const openTime = selectedStation
      ? convertHourTo24HourTime(selectedStation?.openStartTime)
      : "0";
    const endTime = selectedStation
      ? convertHourTo24HourTime(selectedStation?.openEndTime)
      : "0";
    const currentTime = getCurrentLocalTime();
    // checking time and station time
    const timeValidation = validateTimes(
      queryParmsDataUpdated.BookingStartDateAndTime,
      queryParmsDataUpdated.BookingEndDateAndTime,
      openTime,
      endTime,
      currentTime
    );
    if (!timeValidation.valid) {
      handleAsyncError(dispatch, timeValidation.message);
      return;
    }
    // checking minimum duration
    const validation = validateBookingDates(
      queryParmsDataUpdated.BookingStartDateAndTime.replace(".000Z", "Z"),
      queryParmsDataUpdated.BookingEndDateAndTime.replace(".000Z", "Z")
    );
    if (!validation.valid) {
      handleAsyncError(dispatch, validation.message);
      return;
    }

    return handleBooking(
      e,
      vehicles,
      queryParmsDataUpdated,
      currentUser,
      toggleLoginModal,
      setBookingLoading,
      vehiclePlanData,
      isDiscountZero,
      dispatch,
      tempCouponName,
      tempCouponId,
      handleAsyncError,
      navigate,
      selectedAddOn
    );
  };

  return !loading ? (
    vehicles.length > 0 ? (
      <>
        {/* terms Modal  */}
        <BookingTermModal {...vehicles[0]} />
        <CouponModal />

        <div className="w-[95%] lg:w-[90%] mx-auto my-5 lg:my:3 xl:my-4">
          <form onSubmit={handleCreateBookingSubmit}>
            <div className="flex flex-wrap lg:grid lg:grid-cols-10 lg:gap-4">
              <div className="col-span-7 mb-3 w-full lg:mb-0">
                <div className="mb-3 border-2 border-gray-300 rounded-lg py-2 px-2 lg:px-4 bg-white shadow-md order-1 h-full">
                  <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
                    <div className="flex items-center">
                      <button
                        className="lg:hidden flex items-center gap-1 p-1"
                        type="button"
                        onClick={() => handlePreviousPage(navigate)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 12H6M12 5l-7 7 7 7" />
                        </svg>
                      </button>
                      <h2 className="font-semibold text-base mx-1">
                        Booking Summary
                      </h2>
                    </div>
                    {/* <h2 className="font-semibold hidden lg:block">Price</h2> */}
                  </div>
                  <InfoCard
                    {...vehicles[0]}
                    vehiclePlanData={
                      vehiclePlanData ? vehiclePlanData[0] : null
                    }
                    queryParmsData={queryParmsData}
                  />
                  <DetailsCard
                    refundableDeposit={vehicles[0]?.refundableDeposit}
                    extraKmCharge={vehicles[0]?.extraKmsCharges}
                    lateFee={vehicles[0]?.lateFee}
                    speedLimit={vehicles[0]?.speedLimit}
                  />
                </div>
              </div>

              <div className="flex flex-wrap col-span-3">
                <div className="mb-3 border-2 bg-white border-gray-300 shadow-md rounded-lg pt-2 relative order-2 w-full relative">
                  <div className="px-4 py-1 border-b-2 border-gray-300">
                    <h2 className="font-bold text-base">Price Details</h2>
                  </div>
                  <PriceCard
                    perDayCost={vehicles[0]?.perDayCost}
                    appliedPlans={vehicles[0]?.appliedPlans}
                    refundableDeposit={vehicles[0]?.refundableDeposit}
                    totalRentalCost={vehicles[0]?.totalRentalCost}
                    daysBreakDown={
                      vehicles[0]?._daysBreakdown || vehicles[0]?.daysBreakdown
                    }
                    vehiclePlan={
                      vehicles[0]?.vehiclePlan ? vehicles[0]?.vehiclePlan : null
                    }
                    vehiclePlanData={
                      vehiclePlanData ? vehiclePlanData[0] : null
                    }
                    queryParmsData={queryParmsData}
                    bookingStartDateTime={bookingStartDateTime}
                    bookingEndDateTime={bookingEndDateTime}
                  />
                </div>
                {/* coupon section  */}
                <div className="w-full order-1 mb-3">
                  <PromoCard />
                </div>
                {/* payment option section  */}
                {currentUser !== null && (
                  <div className="mb-3 border-2 border-gray-300 rounded-lg py-2 px-4 bg-white shadow-md order-3 flex flex-col items-center justify-center w-full">
                    <div className="py-2 border-b-2 border-gray-300 w-full">
                      <h2 className="font-semibold">Payment Method</h2>
                    </div>
                    <BookingPaymentCard
                      isDiscountZeroApplied={isDiscountZero}
                      bookingStartDateTime={bookingStartDateTime}
                      bookingEndDateTime={bookingEndDateTime}
                    />
                  </div>
                )}
                <div className="w-full mb-3 border-2 border-gray-300 rounded-lg py-2 px-4 bg-white shadow-md order-3 flex flex-col items-left justify-center lg:max-h-48">
                  <Checkbox
                    labelId={"terms"}
                    ref={termsRef}
                    setValue={setIsTermsChecked}
                  />
                </div>
                <div className="mt-1 order-5 w-full">
                  <button
                    className="bg-theme px-4 py-4 w-full text-gray-100 rounded-lg disabled:bg-theme/60"
                    disabled={
                      !isAllFieldChecked ? true : false || bookingLoading
                    }
                  >
                    {!bookingLoading ? (
                      currentUser === null ? (
                        "Continue Booking"
                      ) : isDiscountZero ? (
                        "Confirm Booking"
                      ) : (
                        "Make Payment"
                      )
                    ) : (
                      <Spinner message={"Do not go back while booking..."} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    ) : (
      <BookingError />
    )
  ) : (
    <SummarySkeleton />
  );
};

export default BookingSummary;
