import { camelCaseToSpaceSeparated, getDurationInDays } from "../../utils";

const RideFareDetails = ({ rides }) => {
  return (
    <>
      {rides && (
        <ul className="w-full leading-8">
          {/* Iterate over all the fields except the totalPrice */}
          {Object.entries(rides?.bookingPrice)
            .filter(
              ([key]) =>
                key !== "totalPrice" &&
                key !== "vehiclePrice" &&
                key !== "rentAmount"
            ) // Exclude totalPrice
            .map(([key, value]) => (
              <li
                key={key}
                className="flex items-center justify-between border-b-2"
              >
                <div>
                  <p className="font-semibold uppercase">
                    {key == "tax"
                      ? `${camelCaseToSpaceSeparated(key)} (18% GST)`
                      : camelCaseToSpaceSeparated(key)}
                  </p>
                  {key != "tax" && value != 0 && (
                    <p className="text-xs text-gray-500 mb-1">
                      (
                      {key == "extraAddonPrice"
                        ? `₹${50} x ${getDurationInDays(
                            rides?.BookingStartDateAndTime,
                            rides?.BookingEndDateAndTime
                          )} ${
                            getDurationInDays(
                              rides?.BookingStartDateAndTime,
                              rides?.BookingEndDateAndTime
                            ) == 1
                              ? "day"
                              : "days"
                          } (Extra Helmet)`
                        : `₹${
                            rides?.bookingPrice?.rentAmount
                          } x ${getDurationInDays(
                            rides?.BookingStartDateAndTime,
                            rides?.BookingEndDateAndTime
                          )} ${
                            getDurationInDays(
                              rides?.BookingStartDateAndTime,
                              rides?.BookingEndDateAndTime
                            ) == 1
                              ? "day"
                              : "days"
                          }`}
                      )
                    </p>
                  )}
                </div>
                <p>₹{value}</p>
              </li>
            ))}

          {/* Display the totalPrice last */}
          {rides?.bookingPrice.totalPrice && (
            <li className="flex items-center justify-between mt-1">
              <p className="font-bold uppercase">Total Price</p>
              <p className="font-bold">₹{rides?.bookingPrice.totalPrice}</p>
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default RideFareDetails;
