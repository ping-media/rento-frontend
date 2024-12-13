import { useEffect, useRef, useState } from "react";
import Checkbox from "../components/Input/CheckBox";
import DetailsCard from "../components/ProductCard/DetailsCard";
import InfoCard from "../components/ProductCard/InfoCard";
import PriceCard from "../components/ProductCard/PriceCard";
import PromoCard from "../components/ProductCard/PromoCard";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchingData, handlebooking } from "../Data";
import {
  addVehiclesData,
  fetchingVehicles,
  removeTempDate,
} from "../Redux/ProductSlice/ProductsSlice";
import { useDispatch, useSelector } from "react-redux";
import SummarySkeleton from "../components/skeleton/SummarySkeleton";
import ErrorImg from "../assets/logo/error.svg";
import { toggleLoginModal } from "../Redux/ModalSlice/ModalSlice";
// import { handleAsyncError } from "../utils/handleAsyncError";

const BookingSummary = () => {
  const termsRef = useRef(null);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const drivingRef = useRef(null);
  const [isDrivingChecked, setIsDrivingChecked] = useState(false);
  const [isAllFieldChecked, setIsAllFieldChecked] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { loading, vehicles } = useSelector((state) => state.vehicles);
  // for getting queryparms value
  const [queryParms] = useSearchParams();
  const [queryParmsData, setQueryParmsData] = useState(
    Object.fromEntries(queryParms.entries())
  );
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [vehiclePlanData, setVehiclePlanData] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

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
        `/getVehicleTblData?_id=${id}&BookingStartDateAndTime=${queryParmsData?.BookingStartDateAndTime}&BookingEndDateAndTime=${queryParmsData?.BookingEndDateAndTime}`
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
  // console.log(vehicles);

  // this function is creating new booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    // if user is not login than don't let user to book the ride
    if (currentUser == null) return dispatch(toggleLoginModal());
    //removing this after we are going to booking
    dispatch(removeTempDate());

    const response = new FormData(e.target);
    const result = Object.fromEntries(response.entries());

    const data = {
      vehicleTableId: vehicles[0]?._id,
      userId: currentUser?._id,
      vehicleMasterId: vehicles[0]?.vehicleMasterId,
      BookingStartDateAndTime: queryParmsData?.BookingStartDateAndTime,
      BookingEndDateAndTime: queryParmsData?.BookingEndDateAndTime,
      bookingPrice: {
        bookingPrice: Number(result?.bookingPrice),
        vehiclePrice: Number(result?.bookingPrice),
        extraAddonPrice:
          result?.extraAddonPrice == "" ? 0 : Number(result?.extraAddonPrice),
        tax: Number(result?.tax),
        totalPrice: Number(result?.totalPrice),
        rentAmount: vehicles[0]?.perDayCost,
      },
      vehicleBasic: {
        refundableDeposit: vehicles[0]?.refundableDeposit,
        speedLimit: vehicles[0]?.speedLimit,
        vehicleNumber: vehicles[0]?.vehicleNumber,
        freeLimit: vehicles[0]?.freeKms,
        lateFee: vehicles[0]?.lateFee,
        extraKmCharge: vehicles[0]?.extraKmsCharges,
      },
      vehicleName: vehicles[0]?.vehicleName,
      vehicleBrand: vehicles[0]?.vehicleBrand,
      vehicleImage: vehicles[0]?.vehicleImage,
      stationName: vehicles[0]?.stationName,
      bookingStatus: "completed",
      paymentStatus: "completed",
      rideStatus: "pending",
      paymentMethod: "cash",
      payInitFrom: "Razor pay",
      paySuccessId: "assa",
    };
    // console.log(data);

    try {
      const response = await handlebooking(data);
      if (response.status == 200) {
        // console.log(response?.data);
        handleAsyncError(dispatch, response?.message, "success");
        navigate(`/my-rides/summary/${response?.data?.bookingId}`);
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  return !loading && !vehicleLoading ? (
    vehicles.length > 0 ? (
      <div className="w-[90%] mx-auto my-4.5 my-5 lg:my:3 xl:my-4">
        <form onSubmit={handleCreateBooking}>
          <div className="flex flex-wrap lg:grid lg:grid-cols-10 lg:gap-4">
            <div className="col-span-7">
              <div className="mb-3 border-2 border-gray-300 rounded-lg py-2 px-2 lg:px-4 bg-white shadow-md order-1">
                <div className="flex items-center justify-between py-3 border-b-2 border-gray-300">
                  <h2 className="font-semibold">Booking Summary</h2>
                  <h2 className="font-semibold hidden lg:block">Price</h2>
                </div>
                <InfoCard
                  {...vehicles[0]}
                  vehiclePlanData={vehiclePlanData ? vehiclePlanData[0] : null}
                  {...queryParmsData}
                />
                <DetailsCard extraKmCharge={vehicles[0]?.extraKmsCharges} />
              </div>
              <PromoCard />
            </div>

            <div className="flex flex-wrap col-span-3">
              <div className="mb-3 border-2 bg-white border-gray-300 shadow-md rounded-lg py-2 px-4 relative order-2 w-full relative">
                <div className="py-3 border-b-2 border-gray-300">
                  <h2 className="font-semibold">Total Price</h2>
                </div>
                <PriceCard
                  perDayCost={vehicles[0]?.perDayCost}
                  vehiclePlanData={vehiclePlanData ? vehiclePlanData[0] : null}
                  {...queryParmsData}
                />
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
                  disabled={!isAllFieldChecked ? true : false}
                  type="submit"
                >
                  Continue Booking
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    ) : (
      <div className="w-[90%] mx-auto my-10">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={ErrorImg} className="w-64 h-64 object-cover" alt="ERROR" />
          <p className="text-center text-2xl uppercase font-semibold my-5">
            Data not found.
          </p>
        </div>
      </div>
    )
  ) : (
    <SummarySkeleton />
  );
};

export default BookingSummary;
