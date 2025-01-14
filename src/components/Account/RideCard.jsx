import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatDateTimeComingFromDatabase,
  formatDateTimeForUser,
  formatPrice,
} from "../../utils";

const RideCard = ({ item, id }) => {
  const [isPageActive, setIsPageActive] = useState(false);
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [createdOn, setCreatedOn] = useState("");

  // this is to change the functionality based on url
  useEffect(() => {
    if (location.pathname == "/my-rides") {
      setIsPageActive(true);
    } else {
      setIsPageActive(false);
    }
  }, [location.href]);

  useEffect(() => {
    setBookingStart(formatDateTimeForUser(item?.BookingStartDateAndTime));
    setBookingEnd(formatDateTimeForUser(item?.BookingEndDateAndTime));
    setCreatedOn(formatDateTimeComingFromDatabase(item?.createdAt));
  }, [item]);

  return (
    <Link to={isPageActive ? `/my-rides/summary/${item?._id}` : "#"}>
      <div
        className={`px-4 py-2 rounded-lg border-2 cursor-pointer ${
          isPageActive ? "shadow-md hover:shadow-lg" : ""
        } flex flex-wrap justify-between mb-3`}
      >
        <div className="flex flex-wrap gap-4 order-2 lg:order-1">
          <div className="w-full w-36 h-36 lg:w-48 lg:h-44">
            <img
              src={item?.vehicleImage}
              className="w-full h-full object-contain"
              loading="lazy"
              alt={item?.vehicleName}
            />
          </div>
          <div>
            <div className="lg:flex items-center mb-2">
              <h2 className="font-bold uppercase text-md lg:text-lg">
                {item?.vehicleBrand} {item?.vehicleName}
              </h2>
              {isPageActive && (
                <>
                  <span className="lg:mx-1 hidden lg:inline">|</span>
                  <span
                    className={`${
                      (item?.paymentStatus === "partially_paid" &&
                        "bg-orange-400") ||
                      (item?.paymentStatus === "partiallyPay" &&
                        "bg-orange-400") ||
                      (item?.paymentStatus === "pending" && "bg-orange-400") ||
                      (item?.paymentStatus === "failed" && "bg-theme") ||
                      (item?.paymentStatus === "refunded" && "bg-theme") ||
                      (item?.paymentStatus === "paid" &&
                        "bg-green-500 bg-opacity-80")
                    } text-gray-100 px-2 rounded-full cursor-pointer capitalize ml-2`}
                  >
                    {item?.paymentStatus.replace("_", " ")}
                  </span>
                </>
              )}
            </div>
            <p className="mb-2 text-xs lg:text-sm text-gray-400">
              <span>Booking ID: #{item?.bookingId}</span>
              <span className="mx-1 hidden lg:inline">|</span>
              <span className="block lg:inline">
                Booked On: {""}
                {createdOn}
              </span>
            </p>
            <p className="mb-2 text-xs lg:text-sm text-gray-400">
              <span className="block mb-2">
                Booking Start Date{" "}
                <span className="hidden lg:inline">And Time</span>:{" "}
                {`${bookingStart?.date} :
              ${bookingStart?.time}`}
              </span>
              <span className="block">
                Booking End Date{" "}
                <span className="hidden lg:inline">And Time</span>:{" "}
                {`${bookingEnd?.date} :
              ${bookingEnd?.time}`}
              </span>
            </p>
            <p className="text-xs lg:text-sm text-gray-400 mb-2 capitalize">
              Station Details: {item?.stationName}
            </p>
            <div className="flex items-center gap-1 lg:gap-2 mb-2">
              <p className="text-xs lg:text-sm text-gray-400">
                {item?.bookingPrice &&
                  `Booking Amount: ₹${formatPrice(
                    item?.bookingPrice?.bookingPrice
                  )}`}
              </p>
              <span className="mx-1 text-sm text-gray-400">|</span>
              <p className="text-xs lg:text-sm text-gray-400">
                {item?.bookingPrice &&
                  `Refundable Deposit Amount: ₹${formatPrice(
                    item?.vehicleBasic?.refundableDeposit
                  )}`}
              </p>
            </div>
            {id && (
              <p className="text-xs lg:text-sm text-gray-400 italic">
                (Deposit Amount to be paid at the time of pickup and will be
                refunded after the drop)
              </p>
            )}
          </div>
        </div>
        {isPageActive ? (
          <div className="order-1 lg:order-2 text-right w-full lg:w-auto">
            <button
              type="button"
              className="uppercase font-semibold text-theme"
            >
              view details
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </Link>
  );
};

export default RideCard;
