import { useSelector } from "react-redux";
import {
  camelCaseToSpaceSeparated,
  formatPrice,
  getDurationInDays,
} from "../../utils";

const RideFareDetails = ({ rides }) => {
  const { general } = useSelector((state) => state.addon);
  const amountLeft =
    (rides?.bookingPrice?.AmountLeftAfterUserPaid &&
    rides?.bookingPrice?.AmountLeftAfterUserPaid?.status !== "paid"
      ? Number(rides?.bookingPrice?.AmountLeftAfterUserPaid?.amount)
      : 0) || 0;
  const extendAmountLeft =
    (rides.bookingPrice?.extendAmount?.length > 0 &&
      rides.bookingPrice?.extendAmount.reduce((sum, transaction) => {
        return transaction.status === "unpaid" ? sum + transaction.amount : sum;
      }, 0)) ||
    0;
  const diffAmountLeft =
    (rides.bookingPrice?.diffAmount &&
      rides.bookingPrice?.diffAmount?.length > 0 &&
      rides.bookingPrice?.diffAmount.reduce((sum, transaction) => {
        return transaction.status === "unpaid" ? sum + transaction.amount : sum;
      }, 0)) ||
    0;

  const payableBalance = rides?.bookingPrice?.payOnPickupMethod
    ? 0
    : Number(amountLeft) + Number(extendAmountLeft) + Number(diffAmountLeft) ||
      Number(rides.bookingPrice?.AmountLeftAfterUserPaid) ||
      (rides?.paymentMethod === "cash" &&
        Number(
          rides?.bookingPrice?.discountTotalPrice > 0
            ? rides?.bookingPrice?.discountTotalPrice
            : rides?.bookingPrice?.totalPrice
        )) ||
      0;

  return (
    <>
      {rides && (
        <>
          {rides?.bookingPrice.isPackageApplied && (
            <div className="text-gray-500 -mb-2.5">
              <span className="font-bold">Package:</span>
              {`(${getDurationInDays(
                rides?.BookingStartDateAndTime,
                rides?.extendBooking?.originalEndDate
                  ? rides?.extendBooking?.originalEndDate
                  : rides?.BookingEndDateAndTime
              )} days Package Applied)`}
            </div>
          )}
          <ul className="w-full leading-8">
            <li className="flex items-center justify-between border-b-2">
              <div className="my-1">
                <p className="text-sm font-semibold uppercase">Booking Price</p>
                <p className="text-xs text-gray-500 mb-1">
                  (
                  {`₹${rides?.bookingPrice?.rentAmount} x ${getDurationInDays(
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
              </div>
              <p>{`₹${formatPrice(rides?.bookingPrice?.bookingPrice)}`}</p>
            </li>

            {/* discount price  */}
            {rides?.bookingPrice?.discountPrice > 0 && (
              <li
                className={`flex items-center justify-between my-1 text-sm border-b-2`}
              >
                <p className="text-sm font-semibold uppercase text-left">
                  Discount Price
                  <small className="text-sm font-semibold text-xs mx-1 block text-gray-400 italic">
                    Coupon: ({rides?.discountCuopon?.couponName})
                  </small>
                </p>
                <p className="font-semibold text-right">
                  {`- ₹${formatPrice(rides?.bookingPrice?.discountPrice)}`}
                </p>
              </li>
            )}
            {Object.entries(rides?.bookingPrice)
              .filter(
                ([key]) =>
                  key !== "totalPrice" &&
                  key !== "vehiclePrice" &&
                  key !== "bookingPrice" &&
                  key !== "rentAmount" &&
                  key !== "isPackageApplied" &&
                  key !== "userPaid" &&
                  key !== "discountPrice" &&
                  key !== "discountTotalPrice" &&
                  key !== "isInvoiceCreated" &&
                  key !== "isPickupImageAdded" &&
                  key !== "isDiscountZero" &&
                  key !== "isChanged" &&
                  key !== "extendAmount" &&
                  key !== "diffAmount" &&
                  key !== "AmountLeftAfterUserPaid" &&
                  key !== "lateFeeBasedOnHour" &&
                  key !== "lateFeeBasedOnKM" &&
                  key !== "payOnPickupMethod" &&
                  key !== "lateFeePaymentMethod" &&
                  key !== "additionFeePaymentMethod" &&
                  key !== "additionalPrice" &&
                  key !== "refundAmount" &&
                  key !== "extraAddonPrice" &&
                  key !== "daysBreakdown"
              ) // Exclude totalPrice
              .map(([key, value]) => {
                if (typeof value === "object") {
                  return (
                    value?.length > 0 &&
                    value?.map((item, index) => (
                      <li
                        key={`key-${index}`}
                        className="flex items-center justify-between border-b-2 text-sm"
                      >
                        <div className="my-1">
                          <p className="text-sm font-semibold uppercase">
                            {item?.name}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            (
                            {`₹${item?.amount} x ${getDurationInDays(
                              rides?.BookingStartDateAndTime,
                              rides?.extendBooking?.originalEndDate ||
                                rides?.BookingEndDateAndTime
                            )} ${
                              getDurationInDays(
                                rides?.BookingStartDateAndTime,
                                rides?.extendBooking?.originalEndDate ||
                                  rides?.BookingEndDateAndTime
                              ) == 1
                                ? "day"
                                : "days"
                            }`}
                            )
                          </p>
                        </div>
                        <p>{`₹${formatPrice(
                          item?.maxAmount > 0
                            ? item?.amount *
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  rides?.extendBooking?.originalEndDate ||
                                    rides?.BookingEndDateAndTime
                                ) >
                              item?.maxAmount
                              ? item?.maxAmount
                              : item?.amount *
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  rides?.extendBooking?.originalEndDate ||
                                    rides?.BookingEndDateAndTime
                                )
                            : item?.amount *
                                getDurationInDays(
                                  rides?.BookingStartDateAndTime,
                                  rides?.extendBooking?.originalEndDate ||
                                    rides?.BookingEndDateAndTime
                                )
                        )}`}</p>
                      </li>
                    ))
                  );
                } else {
                  if (general?.status === "inactive" && key == "tax") {
                    return null;
                  }
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between border-b-2"
                    >
                      <div className="my-1">
                        <p className="text-sm font-semibold uppercase">
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
                  );
                }
              })}

            {/* totalPrice */}
            {rides?.bookingPrice?.discountTotalPrice === 0 &&
              rides?.bookingPrice?.isDiscountZero !== true &&
              rides?.bookingPrice?.totalPrice && (
                <li className="flex items-center justify-between mt-1 my-1 text-sm">
                  <p className="text-sm font-bold uppercase text-left">
                    {rides?.bookingPrice?.discountPrice &&
                    rides?.bookingPrice?.discountPrice != 0
                      ? "Subtotal"
                      : "Total Price"}
                    <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                      {rides?.bookingPrice?.discountPrice &&
                      rides?.bookingPrice?.discountPrice != 0
                        ? ""
                        : rides?.paymentMethod == "online" &&
                          rides?.paySuccessId != "NA"
                        ? "(Full Paid)"
                        : rides?.paymentMethod == "partiallyPay"
                        ? ""
                        : rides?.bookingPrice?.payOnPickupMethod
                        ? `Payment Mode: (${rides?.bookingPrice?.payOnPickupMethod})`
                        : "(need to pay at pickup)"}
                    </small>
                  </p>
                  <p className="text-sm font-bold text-right">
                    {`₹${formatPrice(rides?.bookingPrice?.totalPrice)}`}
                  </p>
                </li>
              )}

            {/* total price  */}
            {(rides?.bookingPrice?.discountTotalPrice > 0 ||
              rides?.bookingPrice?.isDiscountZero === true) && (
              <li
                className={`flex items-center justify-between mt-1 my-1 text-sm ${
                  rides?.bookingPrice?.userPaid &&
                  rides?.paymentStatus !== "pending"
                    ? "border-b-2"
                    : ""
                }`}
              >
                <p className="text-sm font-bold uppercase text-left">
                  Total Price
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.paymentMethod == "online" &&
                    rides?.paySuccessId !== "NA"
                      ? "(Full Paid)"
                      : rides?.paymentMethod == "partiallyPay"
                      ? ""
                      : rides?.bookingPrice?.isDiscountZero === true
                      ? ""
                      : rides?.bookingPrice?.payOnPickupMethod
                      ? `Payment Mode: (${rides?.bookingPrice?.payOnPickupMethod})`
                      : "(Need to pay at pickup)"}
                  </small>
                </p>
                <p className="text-sm font-bold text-right">
                  {`₹${formatPrice(
                    rides?.bookingPrice?.isDiscountZero === true
                      ? 0
                      : rides?.bookingPrice?.discountTotalPrice +
                          rides?.bookingPrice?.extraAddonPrice
                  )}`}
                </p>
              </li>
            )}

            {/* user paid */}
            {rides?.bookingPrice?.userPaid > 0 &&
              rides?.paymentStatus !== "pending" && (
                <>
                  <li className="flex items-center justify-between mt-1 my-1 text-sm">
                    <p className="text-sm font-semibold uppercase text-left">
                      Amount Paid
                    </p>
                    <p className="text-sm font-bold text-right">
                      {`- ₹${formatPrice(rides?.bookingPrice?.userPaid)}`}
                    </p>
                  </li>
                </>
              )}

            {/* difference amount  */}
            {rides?.bookingPrice?.diffAmount && (
              <li className="flex items-center justify-between pt-1 mt-1 border-t-2 text-sm">
                <p className="text-sm font-semibold uppercase text-left">
                  Difference Amount
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.bookingPrice?.diffAmount[
                      rides?.bookingPrice?.diffAmount?.length - 1
                    ]?.status === "paid"
                      ? "(Paid)"
                      : "(need to pay this amount)"}
                  </small>
                </p>
                <p className="text-sm font-bold text-right">
                  {`₹${formatPrice(
                    Number(
                      rides?.bookingPrice?.diffAmount?.[
                        rides?.bookingPrice?.diffAmount?.length - 1
                      ]?.amount
                    )
                  )}`}
                </p>
              </li>
            )}

            {/* extend amount  */}
            {rides?.bookingPrice?.extendAmount?.length > 0 && (
              <li className="flex items-center justify-between pt-1 mt-1 border-t-2 text-sm">
                <p className="text-sm font-semibold uppercase text-left">
                  Extend Amount
                  <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                    {rides?.bookingPrice?.extendAmount[
                      rides?.bookingPrice?.extendAmount?.length - 1
                    ]?.status === "paid"
                      ? "(Paid)"
                      : "(New Price For Extend booking)"}
                  </small>
                </p>
                <p className="text-sm font-bold text-right text-theme">
                  {`₹${formatPrice(
                    Number(
                      rides?.bookingPrice?.extendAmount[
                        rides?.bookingPrice?.extendAmount?.length - 1
                      ]?.amount
                    )
                  )}`}
                </p>
              </li>
            )}

            {/* payable balance  */}
            {(rides?.paymentMethod === "cash" ||
              rides?.paymentStatus !== "pending") && (
              <li className="flex items-center justify-between pt-1 mt-1 border-t-2 text-sm">
                <p className="text-sm font-semibold uppercase text-left">
                  Payable Balance
                </p>
                <p className="text-sm font-bold text-right text-theme">
                  {`₹${formatPrice(payableBalance)}`}
                </p>
              </li>
            )}
            {/* refunded amount */}
            <li className="flex items-center justify-between pt-1 mt-1 border-t-2 text-sm">
              <p className="text-sm font-semibold uppercase text-left">
                Refundable Deposit Amount
                <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                  (need to pay at pickup and will be refunded after drop)
                </small>
              </p>
              <p className="text-sm font-bold text-right">
                {`₹${formatPrice(
                  Number(rides?.vehicleBasic?.refundableDeposit)
                )}`}
              </p>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default RideFareDetails;
