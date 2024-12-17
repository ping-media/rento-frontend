import {
  camelCaseToSpaceSeparated,
  formatPrice,
  getDurationInDays,
} from "../../utils";

const RideFareDetails = ({ rides }) => {
  return (
    <>
      {rides && (
        <>
          {rides?.bookingPrice.isPackageApplied && (
            <div className="text-gray-500 -mb-2.5">
              <span className="font-bold">Package:</span>
              {`(${getDurationInDays(
                rides?.BookingStartDateAndTime,
                rides?.BookingEndDateAndTime
              )} days Package Applied)`}
            </div>
          )}
          <ul className="w-full leading-8">
            {/* Iterate over all the fields except the totalPrice */}
            {Object.entries(rides?.bookingPrice)
              .filter(
                ([key]) =>
                  key !== "totalPrice" &&
                  key !== "vehiclePrice" &&
                  key !== "rentAmount" &&
                  key !== "isPackageApplied"
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
                    {key != "tax" &&
                      value != 0 &&
                      !rides?.bookingPrice.isPackageApplied && (
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
                  <p>₹{formatPrice(value)}</p>
                </li>
              ))}

            {/* Display the totalPrice last */}
            {rides?.bookingPrice.totalPrice && (
              <li className="flex items-center justify-between mt-1">
                <p className="font-bold uppercase">Total Price</p>
                <p className="font-bold">
                  ₹{formatPrice(rides?.bookingPrice.totalPrice)}
                </p>
              </li>
            )}
          </ul>
        </>
      )}
    </>
  );
};

export default RideFareDetails;