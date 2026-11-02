import {
  formatDateTimeForUser,
  formatPrice,
  getDurationInDays,
} from "../../utils";
import Tooltip from "../Tooltip/Tooltip";
import { renderTooltipBreakdown } from "../../utils/helper.jsx";
import { useState } from "react";
import DialogWrapper from "../Modals/DialogWrapper.jsx";

const getDiffAmount = (rides, status = "unpaid") => {
  return (
    (rides.bookingPrice?.diffAmount &&
      rides.bookingPrice?.diffAmount?.length > 0 &&
      rides.bookingPrice?.diffAmount.reduce((sum, transaction) => {
        return transaction.status === status
          ? sum +
              transaction.amount +
              (transaction?.tax || 0) +
              (transaction?.addonTax || 0)
          : sum;
      }, 0)) ||
    0
  );
};

const openBreakdownModal = (type, items = [], setModelContent, setOpen) => {
  let content = null;

  if (type === "extension") {
    content = (
      <div className="divide-y">
        {items.map((item, i) => {
          const startDate = item?.BookingStartDateAndTime
            ? formatDateTimeForUser(item.BookingStartDateAndTime)
            : null;
          const endDate =
            item.bookingEndDateAndTime || item.BookingEndDateAndTime
              ? formatDateTimeForUser(
                  item.bookingEndDateAndTime || item.BookingEndDateAndTime,
                )
              : null;

          return (
            <div
              key={i}
              className="flex justify-between items-center py-3 text-sm"
            >
              {/* Left side */}
              <div>
                <p className="font-semibold text-left">
                  {item.extendDuration} days
                </p>
                <p className="text-xs text-gray-500">
                  {startDate !== null ? startDate?.date : "--"} →{" "}
                  {endDate !== null ? endDate?.date : "--"}
                </p>
              </div>

              {/* Right side */}
              <p className="font-medium">
                ₹
                {formatPrice(
                  item.amount + (item?.tax || 0) + (item?.addonTax || 0),
                )}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === "vehicleChange") {
    content = (
      <div className="divide-y">
        {items.map((item, i) => {
          const isRefund = item.refundAmount > 0;
          const isZero = item.amount === 0 && item.refundAmount === 0;

          const amount = isRefund ? item.refundAmount : item.amount;

          return (
            <div
              key={i}
              className="flex justify-between items-center py-3 text-sm"
            >
              {/* Left */}
              <p className="font-semibold">Vehicle Change</p>

              {/* Right */}
              <p
                className={`font-medium ${
                  isZero
                    ? "text-black"
                    : isRefund
                      ? "text-green-600"
                      : "text-theme"
                }`}
              >
                {isZero
                  ? `₹${formatPrice(0)}`
                  : isRefund
                    ? `₹${formatPrice(amount)}`
                    : `₹${formatPrice(amount)}`}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  setModelContent({
    title:
      type === "extension" ? "Extension Breakdown" : "Vehicle Change Breakdown",
    content,
  });

  setOpen(true);
};

const RideFareDetails = ({ rides }) => {
  const [open, setOpen] = useState(false);
  const [modelContent, setModelContent] = useState({
    title: "",
    content: null,
  });

  const amountLeft =
    (rides?.bookingPrice?.AmountLeftAfterUserPaid &&
    rides?.bookingPrice?.AmountLeftAfterUserPaid?.status !== "paid"
      ? Number(rides?.bookingPrice?.AmountLeftAfterUserPaid?.amount)
      : 0) || 0;

  const extendAmountLeft =
    (rides.bookingPrice?.extendAmount?.length > 0 &&
      rides.bookingPrice?.extendAmount.reduce((sum, transaction) => {
        return transaction.status === "unpaid"
          ? sum +
              transaction.amount +
              (transaction?.tax || 0) +
              (transaction?.addonTax || 0)
          : sum;
      }, 0)) ||
    0;

  const diffAmountLeft = getDiffAmount(rides);
  const diffAmount = getDiffAmount(rides, "paid");

  const payableBalance = rides?.bookingPrice?.payOnPickupMethod
    ? 0
    : Number(amountLeft) + Number(extendAmountLeft) + Number(diffAmountLeft) ||
      Number(rides.bookingPrice?.AmountLeftAfterUserPaid) ||
      (rides?.paymentMethod === "cash" &&
        Number(
          rides?.bookingPrice?.discountTotalPrice > 0
            ? rides?.bookingPrice?.discountTotalPrice
            : rides?.bookingPrice?.totalPrice,
        )) ||
      0;

  const totalExtendAmount =
    rides?.bookingPrice?.extendAmount?.reduce((sum, item) => {
      if (item.status === "paid") {
        return sum + item.amount + (item?.tax || 0) + (item?.addonTax || 0);
      }
      return sum;
    }, 0) || 0;

  const isRideCompleted = rides?.rideStatus === "completed";

  const paidExtensions =
    rides?.bookingPrice?.extendAmount?.filter((i) => i.status === "paid") || [];
  const lastPaidExtension = paidExtensions[paidExtensions.length - 1];

  const lastExtendAmount = lastPaidExtension
    ? lastPaidExtension.amount +
      (lastPaidExtension?.tax || 0) +
      (lastPaidExtension?.addonTax || 0)
    : 0;

  // completed: sum of all paid extensions, otherwise only the last paid one
  const displayExtendAmount = isRideCompleted
    ? totalExtendAmount
    : lastExtendAmount;

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={() => setOpen(false)}
        title={modelContent.title}
        className="top-40 md:top-20"
      >
        {modelContent.content}
      </DialogWrapper>

      {rides && (
        <>
          {rides?.bookingPrice.isPackageApplied && (
            <div className="text-gray-500 -mb-2.5">
              <span className="font-bold">Package:</span>
              {`(${getDurationInDays(
                rides?.BookingStartDateAndTime,
                rides?.bookingPrice?.extendAmount?.[0]
                  ?.originalBookingEndDateAndTime
                  ? rides?.bookingPrice?.extendAmount?.[0]
                      ?.originalBookingEndDateAndTime
                  : rides?.BookingEndDateAndTime,
              )} days Package Applied)`}
            </div>
          )}
          <ul className="w-full leading-7 divide-y-2 divide-gray-200">
            <li className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold capitalize">
                  Booking Price
                </p>
                <div className="text-xs text-gray-400">
                  <Tooltip
                    buttonMessage={"(?)"}
                    className="font-bold text-gray-500"
                    tooltipData={renderTooltipBreakdown(
                      rides?.bookingPrice?.appliedPlan ||
                        rides?.bookingPrice?.appliedPlans,
                      rides?.bookingPrice?.daysBreakdown,
                    )}
                  />
                </div>
              </div>
              <p>{`₹${formatPrice(rides?.bookingPrice?.bookingPrice)}`}</p>
            </li>

            {/* discount price  */}
            {rides?.bookingPrice?.discountPrice > 0 && (
              <li
                className={`flex items-center justify-between py-1.5 text-sm`}
              >
                <p className="text-sm font-semibold capitalize text-left">
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

            {/* Extra Addon Details */}
            {rides?.bookingPrice?.extraAddonDetails?.length > 0 &&
              rides?.bookingPrice?.extraAddonDetails?.map((item, index) => (
                <li
                  key={`addon-${index}`}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {item?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {`₹${item?.amount} x ${getDurationInDays(
                        rides?.BookingStartDateAndTime,
                        rides?.extendBooking?.originalEndDate ||
                          rides?.BookingEndDateAndTime,
                      )} ${
                        getDurationInDays(
                          rides?.BookingStartDateAndTime,
                          rides?.extendBooking?.originalEndDate ||
                            rides?.BookingEndDateAndTime,
                        ) === 1
                          ? "day"
                          : "days"
                      }`}
                    </p>
                  </div>
                  <p>{`₹${formatPrice(
                    item?.maxAmount > 0
                      ? Math.min(
                          item?.amount *
                            getDurationInDays(
                              rides?.BookingStartDateAndTime,
                              rides?.extendBooking?.originalEndDate ||
                                rides?.BookingEndDateAndTime,
                            ),
                          item?.maxAmount,
                        )
                      : item?.amount *
                          getDurationInDays(
                            rides?.BookingStartDateAndTime,
                            rides?.extendBooking?.originalEndDate ||
                              rides?.BookingEndDateAndTime,
                          ),
                  )}`}</p>
                </li>
              ))}

            {/* GST */}
            {rides?.stationData?.isGstActive !== "inactive" &&
              rides?.bookingPrice?.tax > 0 && (
                <li className="flex items-center py-1.5 justify-between">
                  <p className="text-sm font-semibold capitalize">
                    {`GST(${rides?.vehicleMasterId?.gstPercentage || "--"}%)`}
                  </p>
                  <p>{`₹${formatPrice(rides?.bookingPrice?.tax)}`}</p>
                </li>
              )}

            {/* Addon Tax */}
            {rides?.bookingPrice?.addonTax > 0 && (
              <li className="flex items-center py-1.5 justify-between">
                <p className="text-sm font-semibold capitalize">Addon Tax</p>
                <p>{`₹${formatPrice(rides?.bookingPrice?.addonTax)}`}</p>
              </li>
            )}

            {/* totalPrice */}
            {rides?.bookingPrice?.discountPrice > 0 &&
              rides?.bookingPrice?.discountTotalPrice === 0 &&
              rides?.bookingPrice?.isDiscountZero !== true &&
              rides?.bookingPrice?.totalPrice && (
                <li className="flex items-center justify-between text-sm py-1.5">
                  <p className="text-sm font-bold capitalize text-left">
                    Subtotal
                    <small className="font-semibold text-xs mx-1 block text-gray-400 italic">
                      {rides?.paymentMethod == "online" &&
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
                className={`flex items-center justify-between py-1.5 text-sm 
                `}
              >
                <p className="text-sm font-bold capitalize text-left">
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
                          rides?.bookingPrice?.extraAddonPrice,
                  )}`}
                </p>
              </li>
            )}

            {/* user paid */}
            {rides?.bookingPrice?.userPaid > 0 &&
              rides?.paymentStatus !== "pending" && (
                <>
                  <li className="flex items-center justify-between py-1.5 text-sm">
                    <p className="text-sm font-semibold capitalize text-left">
                      Amount Paid
                    </p>
                    <p className="text-sm font-bold text-right">
                      {`- ₹${formatPrice(rides?.bookingPrice?.userPaid)}`}
                    </p>
                  </li>
                </>
              )}

            {/* difference amount  */}
            {diffAmount > 0 && (
              <li className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold capitalize text-left">
                    Vehicle Change Price
                  </p>
                  <button
                    onClick={() =>
                      openBreakdownModal(
                        "vehicleChange",
                        rides?.bookingPrice?.diffAmount?.filter(
                          (i) => i.status === "paid",
                        ),
                        setModelContent,
                        setOpen,
                      )
                    }
                    className="text-sm underline underline-offset-1"
                  >
                    (?)
                  </button>
                </div>
                <p className="text-sm text-right">
                  {`₹${formatPrice(Number(diffAmount))}`}
                </p>
              </li>
            )}

            {/* extend amount  */}
            {displayExtendAmount > 0 && (
              <li className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold capitalize text-left">
                    {!isRideCompleted
                      ? "Last Extension Price"
                      : "Extension Price"}
                  </p>
                  {isRideCompleted && (
                    <button
                      onClick={() =>
                        openBreakdownModal(
                          "extension",
                          rides?.bookingPrice?.extendAmount?.filter(
                            (i) => i.status === "paid",
                          ),
                          setModelContent,
                          setOpen,
                        )
                      }
                      className="text-sm underline underline-offset-1"
                    >
                      (?)
                    </button>
                  )}
                </div>
                <p className="text-sm text-right">
                  {`₹${formatPrice(displayExtendAmount)}`}
                </p>
              </li>
            )}

            {isRideCompleted && (
              <li className="flex items-center justify-between py-1.5 text-sm">
                <p className="text-sm font-bold capitalize text-left">
                  Final Total
                </p>
                <p className="text-sm font-bold text-right">
                  {`₹${formatPrice(
                    (rides?.bookingPrice?.discountTotalPrice ||
                      rides?.bookingPrice?.totalPrice ||
                      0) +
                      totalExtendAmount +
                      (rides?.bookingPrice?.diffAmount?.reduce((sum, item) => {
                        return item.status === "paid"
                          ? sum +
                              item.amount +
                              (item?.tax || 0) +
                              (item?.addonTax || 0)
                          : sum;
                      }, 0) || 0),
                  )}`}
                </p>
              </li>
            )}

            {/* payable balance  */}
            {(rides?.paymentMethod === "cash" ||
              rides?.paymentStatus !== "pending") && (
              <li className="flex items-center justify-between py-1.5 text-sm">
                <p className="text-sm font-semibold capitalize text-left">
                  Payable Balance
                </p>
                <p className="text-sm font-bold text-right text-theme">
                  {`₹${formatPrice(payableBalance)}`}
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
