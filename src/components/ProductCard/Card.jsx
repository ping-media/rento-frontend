import { Link, useSearchParams } from "react-router-dom";
import bikeImage from "../../assets/logo/bike.png";
import scooterImage from "../../assets/logo/scooter.png";
import { useEffect, useRef, useState } from "react";
import { handleErrorImage, updateQueryParams } from "../../utils";

const Card = ({
  perDayCost,
  vehicleImage,
  vehicleName,
  vehicleType,
  vehicleBrand,
  stationName,
  vehicleModel,
  freeKms,
  extraKmsCharges,
  _id,
}) => {
  const [queryParms] = useSearchParams();
  const productImageRef = useRef(null);
  const [bookingUrl, setBookingUrl] = useState("");
  // through this we can get all queryParms and than use it
  const [queryParmsData] = useState(Object.fromEntries(queryParms.entries()));

  useEffect(() => {
    const url = updateQueryParams("/booking/summary/", _id, queryParmsData);
    setBookingUrl(url);
  }, []);

  return (
    <Link to={bookingUrl} className="relative">
      <div className="bg-white rounded-lg cursor-pointer shadow-md hover:shadow-xl relative">
        {/* modal & color of vehicle  */}
        <div className="top-4 right-0 absolute">
          <p
            className="bg-theme-black text-gray-100 px-2 py-1 rounded-l-lg mb-1"
            title="Vehicle Modal"
          >
            {vehicleModel}
          </p>
        </div>
        <div className="px-3 py-1.5">
          <div className="w-full h-48 rounded-lg mb-2.5">
            <img
              src={vehicleImage}
              className="w-full h-full object-contain"
              alt={vehicleName}
              loading="lazy"
              onError={() => handleErrorImage(vehicleType, productImageRef)}
              ref={productImageRef}
            />
          </div>
          <div className="mb-2">
            <h2 className="font-bold truncate uppercase">
              {vehicleBrand} {vehicleName}
            </h2>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-8 h-8 mr-1">
              <img
                src={vehicleType === "gear" ? bikeImage : scooterImage}
                alt={vehicleType}
              />
            </div>
            <p>
              <span className="font-semibold">{freeKms}</span> KM Limit
            </p>
          </div>
          <p className="text-xs mb-5">
            (After Limit {extraKmsCharges}/KM + GST)
          </p>
          <div className="flex items-center justify-between mb-2">
            <p>
              <span className="mr-1">₹</span>
              {perDayCost}/<span className="text-sm">day</span>
            </p>
            <button className="px-3 py-2 bg-theme-black hover:bg-theme transition duration-200 ease-in-out text-gray-100 rounded-lg">
              Rent Now
            </button>
          </div>
          <p className="text-gray-600">
            Pickup at{" "}
            <span className="text-theme truncate capitalize">
              {stationName}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
