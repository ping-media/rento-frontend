import { useRef, useState } from "react";
import scooterImg from "../../assets/images/scooter-image.png";
import bikeImg from "../../assets/images/bike-image.png";
import {
  formatDateTimeForUser,
  getDurationInDays,
  handleErrorImage,
} from "../../utils";

const InfoCard = ({
  vehicleBrand,
  vehicleImage,
  vehicleName,
  perDayCost,
  vehicleType,
  vehicleId,
  freeKms,
  stationName,
  BookingStartDateAndTime,
  BookingEndDateAndTime,
}) => {
  const vehicleImageRef = useRef(null);
  const [bookingStartDateTime, setBookingStartDateTime] = useState(
    BookingStartDateAndTime && formatDateTimeForUser(BookingStartDateAndTime)
  );
  const [bookingEndDateTime, setBookingEndDateTime] = useState(
    BookingEndDateAndTime && formatDateTimeForUser(BookingEndDateAndTime)
  );
  console.log(
    formatDateTimeForUser(BookingStartDateAndTime),
    formatDateTimeForUser(BookingEndDateAndTime)
  );
  return (
    <div className="flex justify-between flex-wrap mt-6 mb-4 px-4">
      {vehicleImage ? (
        <div className="w-52 h-40 mx-auto lg:mx-0">
          <img
            src={vehicleImage}
            className="w-full h-full object-contain rounded-lg"
            alt={vehicleName}
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
        {vehicleBrand && vehicleName ? (
          <h2 className="font-semibold mb-3 uppercase">
            {vehicleBrand} {vehicleName}
          </h2>
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
        <div className="flex gap-2">
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
              <label htmlFor="drop">Drop</label>
              <div id="drop" className="border-2 rounded-lg p-2">
                <p className="font-semibold">{bookingEndDateTime?.date}</p>
                <p className="font-semibold">{bookingEndDateTime?.time}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
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
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </span>
          Booked For:
          <span className="font-semibold">
            {getDurationInDays(
              bookingStartDateTime?.date,
              bookingEndDateTime?.date
            )}{" "}
            Day
          </span>
        </div>
        {freeKms ? (
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
            <span className="font-semibold">{freeKms}KM</span>
          </div>
        ) : (
          <div>
            <div className="h-4 w-12 bg-gray-400 rounded mb-1"></div>
            <div className="h-4 w-12 bg-gray-400 rounded mb-1"></div>
          </div>
        )}
      </div>
      <div className="mt-2 lg:mt-0">
        <h2 className="font-semibold flex items-center px-2">
          <span className="lg:hidden">
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
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </span>
          ₹ {Number(perDayCost)}/<span className="text-sm">day</span>
        </h2>
      </div>
    </div>
  );
};

export default InfoCard;
