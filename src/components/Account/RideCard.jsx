import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RideCard = ({ item, formatedDateAndTime = null }) => {
  const [isPageActive, setIsPageActive] = useState(false);

  useEffect(() => {
    if (location.pathname == "/my-rides") {
      setIsPageActive(true);
    } else {
      setIsPageActive(false);
    }
  }, [location.href]);

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 cursor-pointer ${
        isPageActive ? "shadow-md hover:shadow-lg" : ""
      } flex flex-wrap justify-between mb-3`}
    >
      <div className="flex flex-wrap gap-4 order-2 lg:order-1">
        <div className="w-full lg:w-48 h-44">
          <img
            src={item?.vehicleImage}
            className="w-full h-full object-contain"
            alt={item?.vehicleName}
          />
        </div>
        <div>
          <h2 className="font-bold uppercase mb-2 text-md md:text:lg lg:text-xl">
            {item?.vehicleBrand} {item?.vehicleName}
          </h2>
          <p className="mb-2 text-sm text-gray-400">
            <span>Booking ID: #{item?.bookingId}</span>
            <span className="mx-1">|</span>
            <span>
              Booking Date And Time:{" "}
              {formatedDateAndTime == null
                ? item?.bookingDate
                : `${formatedDateAndTime?.date} :
              ${formatedDateAndTime?.time}`}
            </span>
          </p>
          <p className="text-sm text-gray-400 mb-2 capitalize">
            Station Details: {item?.stationName}
          </p>
          <p className="text-sm text-gray-400 mb-2">
            {/* Rent Period: {getDurationInDays(startDate?.date, endDate?.date)} */}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-gray-400">
              {item?.bookingPrice &&
                `Booking Amount: ₹${item?.bookingPrice?.bookingPrice}`}
            </p>
            <span className="mx-1 text-sm text-gray-400">|</span>
            <p className="text-sm text-gray-400">
              {item?.bookingPrice &&
                `Deposit Amount: ₹${item?.vehicleBasic?.refundableDeposit}`}
            </p>
          </div>
        </div>
      </div>
      {isPageActive ? (
        <Link
          to={`/my-rides/summary/${item?.bookingId}`}
          className="order-1 lg:order-2 text-right w-full lg:w-auto"
        >
          <button type="button" className="uppercase font-semibold text-theme">
            view details
          </button>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};

export default RideCard;
