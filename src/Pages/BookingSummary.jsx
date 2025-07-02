import { lazy, useMemo, Suspense, useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "../components/Input/CheckBox";
import DetailsCard from "../components/ProductCard/DetailsCard";
import InfoCard from "../components/ProductCard/InfoCard";
import PriceCard from "../components/ProductCard/PriceCard";
import PromoCard from "../components/ProductCard/PromoCard";
import Spinner from "../components/Spinner/Spinner";
import BookingPaymentCard from "../components/ProductCard/BookingPaymentCard";
import BookingTermModal from "../components/Modals/BookingTermModal";
import {
  toggleBookingTermModal,
  toggleLoginModal,
} from "../Redux/ModalSlice/ModalSlice";
import { handleBooking } from "../Data/Functions";
import { handleSelectedAddOn } from "../Redux/AddOnSlice/AddOnSlice";
import {
  formatDateTimeForUser,
  handlePreviousPage,
  validateBookingDates,
} from "../utils";
import { handleAsyncError } from "../utils/handleAsyncError";
import { useVehicleData } from "../hooks/useBookingSummary";
import SummarySkeleton from "../components/skeleton/SummarySkeleton";

const BookingError = lazy(() => import("../components/Error/BookingError"));
const CouponModal = lazy(() => import("../components/Modals/SuccessModal"));

const BookingSummary = () => {
  const termsRef = useRef(null);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [queryParms] = useSearchParams();

  const queryParmsData = useMemo(
    () => Object.fromEntries(queryParms.entries()),
    [queryParms]
  );

  const bookingStartDateTime = formatDateTimeForUser(
    queryParmsData?.BookingStartDateAndTime
  );
  const bookingEndDateTime = formatDateTimeForUser(
    queryParmsData?.BookingEndDateAndTime
  );

  const { vehiclePlanData } = useVehicleData(id, queryParmsData);

  const { tempCouponName, tempCouponId, isDiscountZero } = useSelector(
    (state) => state.coupon
  );

  const { selectedAddOn } = useSelector((state) => state.addon);
  const { currentUser } = useSelector((state) => state.user);
  const { selectedStation } = useSelector((state) => state.station);
  const { loading, vehicles } = useSelector((state) => state.vehicles);

  const memoizedVehicle = useMemo(() => vehicles?.[0], [vehicles]);

  const vehiclePlan = useMemo(
    () => vehiclePlanData?.[0] || null,
    [vehiclePlanData]
  );
  const isAllFieldChecked = isTermsChecked;

  useEffect(() => {
    return () => {
      dispatch(handleSelectedAddOn([]));
    };
  }, [dispatch]);

  const convertHourTo24HourTime = (hour) =>
    `${String(hour).padStart(2, "0")}:00:00Z`;
  const getCurrentLocalTime = () => new Date().toISOString().split("T")[1];

  const validateTimes = (
    enteredStartTime,
    enteredEndTime,
    openTime,
    closeTime,
    currentTime
  ) => {
    const [_, startTime] = enteredStartTime.split("T");
    const [__, endTime] = enteredEndTime.split("T");
    const isWithin = startTime >= openTime && endTime <= closeTime;
    const isPast = startTime < currentTime;
    return isWithin && !isPast
      ? { valid: true }
      : { valid: false, message: "Invalid booking time." };
  };

  const handleCreateBookingSubmit = (e) => {
    e.preventDefault();
    const openTime = convertHourTo24HourTime(
      selectedStation?.openStartTime || 0
    );
    const endTime = convertHourTo24HourTime(selectedStation?.openEndTime || 0);
    const currentTime = getCurrentLocalTime();

    const timeValidation = validateTimes(
      queryParmsData.BookingStartDateAndTime,
      queryParmsData.BookingEndDateAndTime,
      openTime,
      endTime,
      currentTime
    );
    if (!timeValidation.valid) {
      return handleAsyncError(dispatch, timeValidation.message);
    }

    const durationValidation = validateBookingDates(
      queryParmsData.BookingStartDateAndTime,
      queryParmsData.BookingEndDateAndTime
    );
    if (!durationValidation.valid) {
      return handleAsyncError(dispatch, durationValidation.message);
    }

    return handleBooking(
      e,
      vehicles,
      queryParmsData,
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

  if (loading) return <SummarySkeleton />;
  if (!vehicles.length) return <BookingError />;

  return (
    <>
      <BookingTermModal
        {...memoizedVehicle}
        btnFn={() => dispatch(toggleBookingTermModal())}
      />
      <Suspense fallback={<Spinner message="Loading..." />}>
        <CouponModal />
      </Suspense>

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
                  {...memoizedVehicle}
                  vehiclePlanData={vehiclePlan}
                  queryParmsData={queryParmsData}
                />
                <DetailsCard
                  refundableDeposit={memoizedVehicle?.refundableDeposit}
                  extraKmCharge={memoizedVehicle?.extraKmsCharges}
                  lateFee={memoizedVehicle?.lateFee}
                  speedLimit={memoizedVehicle?.speedLimit}
                />
              </div>
            </div>

            <div className="flex flex-wrap col-span-3">
              <div className="mb-3 border-2 bg-white border-gray-300 shadow-md rounded-lg pt-2 relative order-2 w-full relative">
                <div className="px-4 py-1 border-b-2 border-gray-300">
                  <h2 className="font-bold text-base">Price Details</h2>
                </div>
                <PriceCard
                  perDayCost={memoizedVehicle?.perDayCost}
                  appliedPlans={memoizedVehicle?.appliedPlans}
                  refundableDeposit={memoizedVehicle?.refundableDeposit}
                  totalRentalCost={memoizedVehicle?.totalRentalCost}
                  daysBreakDown={
                    memoizedVehicle?._daysBreakdown ||
                    memoizedVehicle?.daysBreakdown
                  }
                  vehiclePlan={
                    memoizedVehicle?.vehiclePlan
                      ? memoizedVehicle?.vehiclePlan
                      : null
                  }
                  vehiclePlanData={vehiclePlan}
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
                  className="bg-theme px-4 py-4 w-full text-white rounded-lg disabled:bg-theme/60"
                  disabled={!isAllFieldChecked || bookingLoading}
                >
                  {bookingLoading ? (
                    <Spinner message="Do not go back while booking..." />
                  ) : currentUser ? (
                    isDiscountZero ? (
                      "Confirm Booking"
                    ) : (
                      "Make Payment"
                    )
                  ) : (
                    "Continue Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default BookingSummary;
