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
                ([key, value]) =>
                  key !== "totalPrice" &&
                  key !== "vehiclePrice" &&
                  key !== "rentAmount" &&
                  key !== "isPackageApplied" &&
                  key !== "userPaid" &&
                  key !== "discountPrice" &&
                  key !== "discountTotalPrice" &&
                  !(key === "extraAddonPrice" && value === 0)
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
                  <p>{`₹${formatPrice(value)}`}</p>
                </li>
              ))}

            {/* Display the totalPrice & user paid & remaining amount last */}
            {/* totalPrice */}
            {rides?.bookingPrice?.totalPrice && (
              <li className="flex items-center justify-between mt-1">
                <p className="font-bold uppercase text-left">
                  {rides?.bookingPrice?.discountPrice != 0
                    ? "Subtotal"
                    : "Total Price"}
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.paymentMethod == "online" &&
                    rides?.paySuccessId != "NA"
                      ? "(Full Paid)"
                      : rides?.paymentMethod == "partiallyPay"
                      ? ""
                      : "(need to pay at pickup)"}
                  </small>
                </p>
                <p className="font-bold text-right">
                  {`₹${formatPrice(rides?.bookingPrice?.totalPrice)}`}
                </p>
              </li>
            )}
            {/* discount price  */}
            {rides?.bookingPrice?.discountPrice != 0 && (
              <li className="flex items-center justify-between mt-1 border-t-2">
                <p className="font-semibold uppercase text-left">
                  Discount Price
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    Coupon: ({rides?.discountCuopon?.couponName})
                  </small>
                </p>
                <p className="font-semibold text-right">
                  {`- ₹${formatPrice(rides?.bookingPrice?.discountPrice)}`}
                </p>
              </li>
            )}
            {/* discount price  */}
            {rides?.bookingPrice?.discountTotalPrice && (
              <li className="flex items-center justify-between mt-1 border-b-2">
                <p className="font-bold uppercase text-left">
                  Total Price
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.paymentMethod == "online" &&
                    rides?.paySuccessId != "NA"
                      ? "(Full Paid)"
                      : rides?.paymentMethod == "partiallyPay"
                      ? ""
                      : "(need to pay at pickup)"}
                  </small>
                </p>
                <p className="font-bold text-right">
                  {`₹${formatPrice(rides?.bookingPrice?.discountTotalPrice)}`}
                </p>
              </li>
            )}
            {/* user paid */}
            {rides?.bookingPrice?.userPaid && (
              <>
                <li className="flex items-center justify-between mt-1">
                  <p className="font-semibold uppercase text-left">
                    Amount Paid
                  </p>
                  <p className="font-bold text-right">
                    {`- ₹${formatPrice(rides?.bookingPrice?.userPaid)}`}
                  </p>
                </li>
                <li className="flex items-center justify-between mt-1">
                  <p className="font-bold uppercase text-left">
                    Remaining Amount
                    <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                      (need to pay at pickup)
                    </small>
                  </p>
                  <p className="font-bold text-right">
                    {rides?.bookingPrice?.discountPrice != 0
                      ? `₹${formatPrice(
                          rides?.bookingPrice.discountTotalPrice -
                            rides?.bookingPrice?.userPaid
                        )}`
                      : `₹${formatPrice(
                          rides?.bookingPrice.totalPrice -
                            rides?.bookingPrice?.userPaid
                        )}`}
                  </p>
                </li>
                <li className="flex items-center justify-between mt-1 border-t-2">
                  <p className="font-semibold uppercase text-left">
                    Refundable Deposit Amount
                    <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                      (need to pay at pickup and will be refunded after drop)
                    </small>
                  </p>
                  <p className="font-bold text-right">
                    {`₹${formatPrice(Number(1000))}`}
                  </p>
                </li>
              </>
            )}
          </ul>
        </>
      )}
    </>
  );
};

export default RideFareDetails;
