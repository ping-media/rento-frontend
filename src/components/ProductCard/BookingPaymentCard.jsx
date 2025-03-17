const BookingPaymentCard = ({ isDiscountZeroApplied }) => {
  return (
    <>
      {isDiscountZeroApplied === true && (
        <p className="text-xs text-left italic text-gray-400 my-2">
          (No Need to select Payment Method because amount is ₹0.00)
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
            <h2 className="text-md">Pay 20%(Advanced)</h2>
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
      </div>
    </>
  );
};

export default BookingPaymentCard;
