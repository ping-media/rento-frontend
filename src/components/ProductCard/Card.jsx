import { useNavigate, useSearchParams } from "react-router-dom";
import bikeImage from "../../assets/logo/bike.png";
// import soldOutImage from "../../assets/logo/sold-out.svg";
import scooterImage from "../../assets/logo/scooter.png";
import { useEffect, useRef, useState } from "react";
import {
  formatPrice,
  getEarliestDate,
  handleErrorImage,
  updateQueryParams,
} from "../../utils";
import SoldOutCard from "./SoldOutCard";
import { useSelector } from "react-redux";

const Card = ({
  perDayCost,
  vehicleImage,
  vehicleName,
  vehicleType,
  vehicleBrand,
  stationName,
  vehicleModel,
  vehiclePlan,
  freeKms,
  extraKmsCharges,
  BookingEndDate,
  MaintenanceEndDate,
  vehicleDetails,
  _id,
  isSold = false,
}) => {
  const [queryParms] = useSearchParams();
  const productImageRef = useRef(null);
  const [bookingUrl, setBookingUrl] = useState("");
  const [isImgLoading, setIsImgLoading] = useState(true);
  const navigate = useNavigate();
  // through this we can get all queryParms and than use it
  const [queryParmsData] = useState(Object.fromEntries(queryParms.entries()));
  const { filter } = useSelector((state) => state.filter);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // for getting BookingEndDateAndTime when there is vehiclePlan id is present
  const addDaysToISOString = (dateStr, daysToAdd) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    date.setUTCDate(date.getUTCDate() + daysToAdd);
    return date.toISOString().replace(".000Z", "Z");
  };

  useEffect(() => {
    const planId = queryParmsData?.vehiclePlan || "";
    let updatedQueryParams = { ...queryParmsData };
    if (planId !== "") {
      const plan = filter?.find((p) => p?._id === planId);

      if (plan?.planDuration) {
        updatedQueryParams.BookingEndDateAndTime = addDaysToISOString(
          queryParmsData?.BookingStartDateAndTime,
          Number(plan.planDuration)
        );
      }
    }
    const url =
      !BookingEndDate && !MaintenanceEndDate
        ? updateQueryParams("/booking/summary/", _id, updatedQueryParams)
        : `?${updatedQueryParams}`;

    setBookingUrl(url);
  }, []);

  useEffect(() => {
    const planId = queryParmsData?.vehiclePlan || "";

    if (planId !== "") {
      const plan =
        vehiclePlan?.length > 0
          ? vehiclePlan?.filter((plan) => plan._id === planId)
          : null;

      if (plan !== null) {
        setSelectedPlan(plan[0]);
      }
    }
  }, []);

  // sending to ride summary
  const sendToRideSummary = () => {
    // if it is sold than don't navigate
    if (isSold === true) return;
    navigate(bookingUrl);
  };

  const earliestBookingEndDate = getEarliestDate(
    vehicleDetails,
    "BookingEndDate"
  );
  const earliestMaintenanceEndDate = getEarliestDate(
    vehicleDetails,
    "MaintenanceEndDate"
  );

  return (
    <div onClick={sendToRideSummary} className="relative">
      <div className="bg-white rounded-lg cursor-pointer shadow-md hover:shadow-xl relative">
        {((isSold && earliestBookingEndDate !== null) ||
          (isSold && earliestMaintenanceEndDate !== null)) && (
          <SoldOutCard
            BookingEndDate={earliestBookingEndDate}
            MaintenanceEndDate={earliestMaintenanceEndDate}
          />
        )}
        {/* vehicle left */}
        {!isSold && (
          <div className="top-4 left-0 absolute z-[1]">
            <p
              className="bg-theme-black text-gray-100 px-2 py-1 rounded-r-lg mb-1"
              title="Vehicle_Count"
            >
              {vehicleDetails?.length > 20 ? "20+" : vehicleDetails?.length}{" "}
              Left
            </p>
          </div>
        )}
        {/*vehicle modal*/}
        <div className="top-4 right-0 absolute z-[1]">
          <p
            className="bg-theme-black text-gray-100 px-2 py-1 rounded-l-lg mb-1"
            title="Vehicle_Modal"
          >
            {vehicleModel}
          </p>
        </div>
        <div className="px-3 py-1.5">
          <div className="w-full h-32 lg:h-48 rounded-lg mb-2.5 relative">
            <img
              src={vehicleImage}
              className={`w-full h-full object-contain ${
                isImgLoading ? "animate-pulse bg-gray-200" : ""
              }`}
              alt={vehicleName}
              loading="lazy"
              onLoad={() => setIsImgLoading(false)}
              onError={() => handleErrorImage(vehicleType, productImageRef)}
              ref={productImageRef}
            />
          </div>
          <div className="mb-2">
            <h2 className="font-bold truncate uppercase text-left">
              {vehicleBrand} {vehicleName}
            </h2>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-6 lg:w-8 h-6 lg:h-8 mr-1">
              <img
                src={vehicleType === "gear" ? bikeImage : scooterImage}
                loading="lazy"
                alt={vehicleType}
              />
            </div>
            <p>
              <span className="font-semibold">
                {freeKms *
                  (selectedPlan !== null ? selectedPlan?.planDuration : 1)}
              </span>{" "}
              KM Limit
            </p>
          </div>
          <p className="text-xs mb-5 text-left">
            (After Limit {formatPrice(extraKmsCharges)}/KM + GST)
          </p>
          <div className="flex items-center justify-between flex-wrap gap-2 lg:gap-0 mb-2">
            <p>
              <span className="mr-1">₹</span>
              {selectedPlan === null ? (
                <>
                  {formatPrice(perDayCost)}/<span className="text-sm">day</span>
                </>
              ) : (
                formatPrice(selectedPlan?.planPrice)
              )}
            </p>
            <button className="w-full md:w-3/5 lg:w-2/5 px-3 py-2 bg-theme-black hover:bg-theme transition duration-200 ease-in-out text-gray-100 rounded-lg cursor-pointer">
              Rent Now
            </button>
          </div>
          <p className="text-gray-600 text-left">
            Pickup at{" "}
            <span className="text-theme truncate capitalize">
              {stationName}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
