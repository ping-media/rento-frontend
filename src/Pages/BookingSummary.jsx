import { lazy, useEffect, useRef, useState } from "react";
import Checkbox from "../components/Input/CheckBox";
import DetailsCard from "../components/ProductCard/DetailsCard";
import InfoCard from "../components/ProductCard/InfoCard";
import PriceCard from "../components/ProductCard/PriceCard";
import PromoCard from "../components/ProductCard/PromoCard";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchingData } from "../Data";
import {
  addVehiclesData,
  fetchingVehicles,
} from "../Redux/ProductSlice/ProductsSlice";
import { useDispatch, useSelector } from "react-redux";
import SummarySkeleton from "../components/skeleton/SummarySkeleton";
import { toggleLoginModal } from "../Redux/ModalSlice/ModalSlice";
import { handleFetchBookingData } from "../Data/Functions";
import Spinner from "../components/Spinner/Spinner";
import { addTempBookingData } from "../Redux/BookingSlice/BookingSlice";
import { updateQueryParams } from "../utils";
const BookingError = lazy(() => import("../components/Error/BookingError"));

const BookingSummary = () => {
  const termsRef = useRef(null);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const drivingRef = useRef(null);
  const [isDrivingChecked, setIsDrivingChecked] = useState(false);
  const [isAllFieldChecked, setIsAllFieldChecked] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, vehicles } = useSelector((state) => state.vehicles);
  const { tempCouponName, tempCouponId, isDiscountZero } = useSelector(
    (state) => state.coupon
  );
  const [bookingLoading, setBookingLoading] = useState(false);
  // for getting queryparms value
  const [queryParms] = useSearchParams();
  const [queryParmsData, setQueryParmsData] = useState(
    Object.fromEntries(queryParms.entries())
  );
  // for vehicle Data
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [vehiclePlanData, setVehiclePlanData] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // if extra addon is selected than this will run
  useEffect(() => {
    if (isTermsChecked && isDrivingChecked) {
      setIsAllFieldChecked(!isAllFieldChecked);
    } else if (isAllFieldChecked) {
      setIsAllFieldChecked(!isAllFieldChecked);
    }
  }, [isTermsChecked, isDrivingChecked]);

  //fetching the vehicle info based on vehicleId from url and if vehicle plan id present than search that too
  useEffect(() => {
    setQueryParmsData(Object.fromEntries(queryParms.entries()));

    (async () => {
      dispatch(fetchingVehicles());
      const result = await fetchingData(
        `/getAllVehiclesAvailable?_id=${id}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
      );
      // console.log(result);
      dispatch(addVehiclesData(result?.data));
    })();

    // only when vehiclePlan id present
    if (queryParmsData?.vehiclePlan) {
      (async () => {
        setVehicleLoading(true);
        const result = await fetchingData(
          `/getPlanData?_id=${queryParmsData?.vehiclePlan}`
        );
        // console.log(result);
        setVehiclePlanData(result?.data);
        return setVehicleLoading(false);
      })();
    }
  }, []);

  // for send to detail and payment page
  const handleCreateBookingSubmit = (e) => {
    const queryParmsDataUpdated = Object.fromEntries(queryParms.entries());
    return handleFetchBookingData(
      e,
      vehicles,
      queryParmsDataUpdated,
      currentUser,
      toggleLoginModal,
      addTempBookingData,
      setBookingLoading,
      vehiclePlanData,
      isDiscountZero,
      dispatch,
      id,
      updateQueryParams,
      tempCouponName,
      tempCouponId,
      navigate
    );
  };

  return !loading && !vehicleLoading ? (
    vehicles.length > 0 ? (
      <div className="w-[95%] lg:w-[90%] mx-auto my-5 lg:my:3 xl:my-4">
        <form onSubmit={handleCreateBookingSubmit}>
          <div className="flex flex-wrap lg:grid lg:grid-cols-10 lg:gap-4">
            <div className="col-span-7">
              <div className="mb-3 border-2 border-gray-300 rounded-lg py-2 px-2 lg:px-4 bg-white shadow-md order-1 lg:h-[95%]">
                <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
                  <h2 className="font-semibold text-base mx-1">
                    Booking Summary
                  </h2>
                  <h2 className="font-semibold hidden lg:block">Price</h2>
                </div>
                <InfoCard
                  {...vehicles[0]}
                  vehiclePlanData={vehiclePlanData ? vehiclePlanData[0] : null}
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
              <div className="mb-3 border-2 bg-white border-gray-300 shadow-md rounded-lg py-2 relative order-1 w-full relative">
                <div className="px-4 py-3 border-b-2 border-gray-300">
                  <h2 className="font-semibold">Total Price</h2>
                </div>
                <PriceCard
                  perDayCost={vehicles[0]?.perDayCost}
                  vehiclePlan={
                    vehicles[0]?.vehiclePlan ? vehicles[0]?.vehiclePlan : null
                  }
                  vehiclePlanData={vehiclePlanData ? vehiclePlanData[0] : null}
                  queryParmsData={queryParmsData}
                />
              </div>
              <div className="w-full order-2 mb-3">
                <PromoCard />
              </div>
              <div className="mb-3 border-2 border-gray-300 rounded-lg py-2 px-4 bg-white shadow-md order-3 flex flex-col items-center justify-center lg:max-h-48">
                <Checkbox
                  labelId={"terms"}
                  ref={termsRef}
                  setValue={setIsTermsChecked}
                  Message={
                    "Confirm that you are above 18 years of age and you agree to all Terms & Conditions"
                  }
                />
                <Checkbox
                  labelId={"driving"}
                  ref={drivingRef}
                  setValue={setIsDrivingChecked}
                  Message={
                    "The original Driving license needs to be submitted at the time of pickup and the same will be returned at the time of dropping the vehicle."
                  }
                />
              </div>
              <div className="mt-1 order-5 w-full">
                <button
                  className="bg-theme px-4 py-4 w-full text-gray-100 rounded-lg disabled:bg-gray-400"
                  disabled={!isAllFieldChecked ? true : false || bookingLoading}
                  type="submit"
                >
                  {!bookingLoading ? (
                    "Continue Booking"
                  ) : (
                    <Spinner message={"loading..."} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    ) : (
      <BookingError />
    )
  ) : (
    <SummarySkeleton />
  );
};

export default BookingSummary;
