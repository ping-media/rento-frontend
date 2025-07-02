import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { formatPrice, getDurationInDays } from "../../utils";

const BookingPaymentCard = ({
  isDiscountZeroApplied,
  bookingStartDateTime,
  bookingEndDateTime,
}) => {
  const { tempTotalPrice, tempCouponDiscountTotal } = useSelector(
    (state) => state.coupon
  );
  const { selectedAddOn } = useSelector((state) => state.addon);
  const duration = useMemo(
    () =>
      getDurationInDays(bookingStartDateTime?.date, bookingEndDateTime?.date),
    [bookingStartDateTime?.date, bookingEndDateTime?.date]
  );

  const finalPrice = useMemo(() => {
    const extraAddonPrice =
      selectedAddOn?.length > 0
        ? selectedAddOn.reduce((total, addon) => {
            const addonTotal =
              addon?.maxAmount !== 0
                ? addon.amount * duration < addon.maxAmount
                  ? addon.amount
                  : addon.maxAmount
                : addon.amount;
            return total + addonTotal;
          }, 0)
        : 0;

    const priceToUse =
      Number(tempCouponDiscountTotal) !== 0
        ? Number(tempCouponDiscountTotal)
        : Number(tempTotalPrice);

    if (priceToUse !== 0) {
      return Math.round((priceToUse + extraAddonPrice) * 0.2);
    }
    return 0;
  }, [tempTotalPrice, tempCouponDiscountTotal, selectedAddOn, duration]);

  return (
    <>
      {isDiscountZeroApplied === true && (
        <p className="text-xs text-left italic text-gray-400 my-2">
          (No Need to select Payment Method because amount is ₹0)
        </p>
      )}
      <div className="w-full my-2">
        {/* 20% payment through online  */}
        <label className="has-[:checked]:bg-white/30 has-[:checked]:text-theme has-[:checked]:ring-theme has-[:checked]:ring-2 cursor-pointer bg-white/40 hover:bg-white/20 w-full p-3 rounded-md flex justify-between items-center shadow mb-1.5">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
            </div>
            <h2 className="text-md">
              Pay 20%(₹{formatPrice(finalPrice)} Advance)
            </h2>
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value={"partiallyPay"}
            disabled={isDiscountZeroApplied}
            className="checked:border-theme h-4 w-4 accent-theme disabled:bg-gray-500"
          />
        </label>
        {/* full payment through online  */}
        <label className="has-[:checked]:bg-white/30 has-[:checked]:text-theme has-[:checked]:ring-theme has-[:checked]:ring-2 cursor-pointer bg-white/40 hover:bg-white/20 w-full p-3 rounded-md flex justify-between items-center shadow mb-1.5">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
            </div>
            <h2 className="text-md">Full Payment</h2>
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value={"online"}
            disabled={isDiscountZeroApplied}
            className="checked:border-theme h-4 w-4 accent-theme"
          />
        </label>
        {/* full payment through cash  */}
        <label className="has-[:checked]:bg-white/30 has-[:checked]:text-theme has-[:checked]:ring-theme has-[:checked]:ring-2 cursor-pointer bg-white/40 hover:bg-white/20 w-full p-3 rounded-md flex justify-between items-center shadow mb-1.5">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </div>
            <h2 className="text-md">Pay Later (At the time of pickup)</h2>
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value={"cash"}
            disabled={isDiscountZeroApplied}
            className="checked:border-theme h-4 w-4 accent-theme"
          />
        </label>
      </div>
    </>
  );
};

export default React.memo(BookingPaymentCard);
