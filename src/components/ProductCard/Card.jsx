import { useNavigate, useSearchParams } from "react-router-dom";
import bikeImage from "../../assets/images/bike-image.webp";
import scooterImage from "../../assets/logo/scooter.webp";
import CarImage from "../../assets/images/car-image.webp";
import React, { useMemo, useRef, useState } from "react";
import {
  formatPrice,
  getEarliestDate,
  handleErrorImage,
  updateQueryParams,
} from "../../utils";
import SoldOutCard from "./SoldOutCard";
import { useSelector } from "react-redux";

// for getting BookingEndDateAndTime when there is vehiclePlan id is present
const addDaysToISOString = (dateStr, daysToAdd) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date.toISOString().replace(".000Z", "Z");
};

const Card = ({
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
  totalRentalCost,
  vehicleMasterData,
  vehicleStatus,
  _id,
  isSold = false,
}) => {
  const [queryParms] = useSearchParams();
  const productImageRef = useRef(null);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const navigate = useNavigate();
  // through this we can get all queryParms and than use it
  const [queryParmsData] = useState(Object.fromEntries(queryParms.entries()));
  const { filter } = useSelector((state) => state.filter);
  const { testMode } = useSelector((state) => state.general);

  const selectedPlan = useMemo(() => {
    const planId = queryParmsData?.vehiclePlan;
    if (!planId) return null;

    return vehiclePlan?.find((p) => p._id === planId) || null;
  }, [queryParmsData, vehiclePlan]);

  const bookingUrl = useMemo(() => {
    let updatedQueryParams = { ...queryParmsData };

    const planId = queryParmsData?.vehiclePlan;
    if (planId) {
      const plan = filter?.find((p) => p?._id === planId);

      if (plan?.planDuration) {
        updatedQueryParams.BookingEndDateAndTime = addDaysToISOString(
          queryParmsData?.BookingStartDateAndTime,
          Number(plan.planDuration),
        );
      }
    }

    return !BookingEndDate && !MaintenanceEndDate
      ? updateQueryParams("/booking/summary/", _id, updatedQueryParams)
      : `?${updatedQueryParams}`;
  }, [queryParmsData, filter, _id, BookingEndDate, MaintenanceEndDate]);

  // sending to ride summary
  const sendToRideSummary = () => {
    if (isSold === true) return;
    navigate(bookingUrl);
  };

  const earliestBookingEndDate = useMemo(
    () => getEarliestDate(vehicleDetails, "BookingEndDate"),
    [vehicleDetails],
  );
  const earliestMaintenanceEndDate = useMemo(
    () => getEarliestDate(vehicleDetails, "MaintenanceEndDate"),
    [],
  );

  const isVehicleSoldOut =
    vehicleStatus === "inactive" ||
    (isSold && testMode) ||
    (isSold && earliestBookingEndDate !== null) ||
    (isSold && earliestMaintenanceEndDate !== null);

  return (
    <div onClick={sendToRideSummary} className="relative">
      <div className="bg-white rounded-lg cursor-pointer shadow-md hover:shadow-xl relative">
        {isVehicleSoldOut && (
          <SoldOutCard
            BookingEndDate={earliestBookingEndDate}
            MaintenanceEndDate={earliestMaintenanceEndDate}
          />
        )}
        {/* vehicle left */}
        {!isSold && (
          <div className="top-1 lg:top-4 left-0 absolute z-[1]">
            <p
              className="background-[rgba( 255, 255, 255, 0.25 )] shadow-md backdrop-blur-sm px-2 py-1 rounded-r-lg mb-1"
              title="Vehicle Count"
            >
              {vehicleDetails?.length || "NA"} Left
            </p>
          </div>
        )}
        {/* vehicle modal */}
        <div className="top-1 lg:top-4 right-0 absolute z-[1]">
          <p
            className="background-[rgba( 255, 255, 255, 0.25 )] shadow-md backdrop-blur-sm px-2 py-1 rounded-l-lg mb-1"
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
                src={
                  vehicleMasterData?.vehicleCategory === "four-wheeler"
                    ? CarImage
                    : vehicleType === "gear"
                      ? bikeImage
                      : scooterImage
                }
                loading="lazy"
                alt={vehicleType}
              />
            </div>
            <p>
              <span className="font-semibold">
                {selectedPlan !== null ? selectedPlan?.kmLimit : freeKms * 1}
              </span>{" "}
              Km Limit
            </p>
          </div>
          <p className="text-xs mb-5 text-left">
            (After Limit {formatPrice(extraKmsCharges)}/KM + GST)
          </p>
          <div
            className={`flex items-center ${
              !isSold ? "justify-between" : "justify-end"
            } flex-wrap gap-2 lg:gap-0 mb-2`}
          >
            {!isSold && (
              <p className="font-semibold text-base">
                <span className="mr-1">₹</span>
                {selectedPlan === null
                  ? formatPrice(totalRentalCost)
                  : formatPrice(selectedPlan?.planPrice)}
              </p>
            )}
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

export default React.memo(Card);
