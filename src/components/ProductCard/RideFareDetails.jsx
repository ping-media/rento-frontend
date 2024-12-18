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
                      key != "userPaid" &&
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
                  <p>
                    {`${key == "userPaid" ? "-" : ""} ₹${formatPrice(value)}`}
                  </p>
                </li>
              ))}

            {/* Display the totalPrice last */}
            {rides?.bookingPrice.totalPrice && (
              <li className="flex items-center justify-between mt-1">
                <p className="font-bold uppercase text-left">
                  Total Price
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.paymentMethod == "online"
                      ? "(Already Paid)"
                      : rides?.paymentMethod == "partiallyPay"
                      ? ""
                      : "(need to pay at pickup)"}
                  </small>
                </p>
                <p className="font-bold text-right">
                  {rides?.bookingPrice?.userPaid ? (
                    <>
                      <small className="block -mb-2 text-gray-500">{`(₹${formatPrice(
                        rides?.bookingPrice?.totalPrice
                      )} - ₹${formatPrice(
                        rides?.bookingPrice?.userPaid
                      )})`}</small>
                      ₹
                      {formatPrice(
                        rides?.bookingPrice.totalPrice -
                          rides?.bookingPrice?.userPaid
                      )}
                    </>
                  ) : (
                    `₹ ${formatPrice(rides?.bookingPrice?.totalPrice)}`
                  )}
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
