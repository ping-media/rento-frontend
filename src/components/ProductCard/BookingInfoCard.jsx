import { useEffect, useRef, useState } from "react";
import {
  formatDateTimeForUser,
  formatPrice,
  getDurationInDays,
  handleErrorImage,
} from "../../utils";

const BookingInfoCard = ({
  vehicleImage,
  vehicleName,
  vehicleType,
  vehicleBrand,
  stationName,
  bookingPrice,
  vehicleBasic,
  BookingStartDateAndTime,
  BookingEndDateAndTime,
}) => {
  const vehicleImageRef = useRef(null);
  const [bookingStartDateTime, setBookingStartDateTime] = useState(null);
  const [bookingEndDateTime, setBookingEndDateTime] = useState(null);

  //converting time into readable format
  useEffect(() => {
    if (BookingStartDateAndTime && BookingEndDateAndTime) {
      setBookingStartDateTime(formatDateTimeForUser(BookingStartDateAndTime));

      setBookingEndDateTime(formatDateTimeForUser(BookingEndDateAndTime));
    }
  }, [BookingStartDateAndTime, BookingEndDateAndTime]);

  return (
    <div className="flex justify-between flex-wrap mt-6 mb-4 cursor-default">
      {vehicleImage ? (
        <div className="w-52 lg:w-62 h-40 mx-auto lg:mx-0">
          <img
            src={vehicleImage}
            className="w-full h-full object-contain rounded-lg"
            alt={vehicleName}
            loading="lazy"
            onError={() => handleErrorImage(vehicleType, vehicleImageRef)}
            ref={vehicleImageRef}
          />
        </div>
      ) : (
        <div className="w-52 h-40 mx-auto lg:mx-0 bg-opacity-50 rounded-lg">
          <img
            src={vehicleType == "gear" ? bikeImg : scooterImg}
            className="w-full h-full object-cover"
            alt={vehicleName}
          />
        </div>
      )}
      <div className="max-w-sm mx-auto lg:mx-0">
        {vehicleBrand && vehicleName && vehicleBasic ? (
          <div className="mb-1.5">
            <h2 className="font-bold uppercase text-xl">
              {vehicleBrand} {vehicleName}
            </h2>
          </div>
        ) : (
          <div className="h-4 w-32 bg-gray-400 rounded mb-3"></div>
        )}
        {stationName ? (
          <div className="flex gap-2 mb-3">
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
            <div>
              <p>Pickup Location</p>
              <p>{stationName}</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="h-4 w-16 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-52 bg-gray-400 rounded mb-1"></div>
          </div>
        )}
        <div className="flex gap-2 cursor-pointer">
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </span>
          <div className="flex items-center gap-4 w-full mb-3">
            <div>
              <label htmlFor="pickup">Pickup</label>
              <div id="pickup" className="border-2 rounded-lg p-2">
                <p className="font-semibold">{bookingStartDateTime?.date}</p>
                <p className="font-semibold">{bookingStartDateTime?.time}</p>
              </div>
            </div>
            <p>TO</p>
            <div>
              <label htmlFor="drop">Dropoff</label>
              <div id="drop" className="border-2 rounded-lg p-2">
                <p className="font-semibold">{bookingEndDateTime?.date}</p>
                <p className="font-semibold">{bookingEndDateTime?.time}</p>
              </div>
            </div>
          </div>
        </div>
        {vehicleBasic ? (
          <div className="flex items-center gap-2">
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
                <circle cx="11.5" cy="8.5" r="5.5" />
                <path d="M11.5 14v7" />
              </svg>
            </span>
            Free Limit:
            <span className="font-semibold">
              {vehicleBasic?.freeLimit *
                getDurationInDays(
                  BookingStartDateAndTime,
                  BookingEndDateAndTime
                )}
              KM
            </span>
            <span className="text-xs me-1 text-gray-500">
              (
              {`${vehicleBasic?.freeLimit} x ${getDurationInDays(
                BookingStartDateAndTime,
                BookingEndDateAndTime
              )} days`}
              )
            </span>
          </div>
        ) : (
          <div>
            <div className="h-4 w-12 bg-gray-400 rounded mb-1"></div>
            <div className="h-4 w-12 bg-gray-400 rounded mb-1"></div>
          </div>
        )}
      </div>
      <div className="pl-4 lg:pl-0 mt-2 lg:mt-0">
        <h2 className="font-semibold flex items-center px-4 lg:px-2">
          <span className="lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </span>
          <div>
            {bookingPrice?.isPackageApplied === true && (
              <p className={`text-lg`}>
                ₹{formatPrice(Number(bookingPrice?.bookingPrice))}
              </p>
            )}
            <p
              className={`${
                bookingPrice?.isPackageApplied === true
                  ? "ml-2 lg:ml-0 text-sm line-through"
                  : "ml-1.5 lg:ml-0 text-lg"
              }`}
            >
              ₹{formatPrice(Number(bookingPrice?.rentAmount))}/
              <span className="text-sm">day</span>
            </p>
          </div>
        </h2>
      </div>
    </div>
  );
};

export default BookingInfoCard;
