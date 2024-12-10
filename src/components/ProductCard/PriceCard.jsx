import { useEffect, useState } from "react";
import {
  calculateTax,
  formatDateTimeForUser,
  getDurationInDays,
} from "../../utils";

const PriceCard = ({
  perDayCost,
  vehiclePlanData,
  BookingStartDateAndTime,
  BookingEndDateAndTime,
}) => {
  const bookingStartDateTime =
    BookingStartDateAndTime && formatDateTimeForUser(BookingStartDateAndTime);
  const bookingEndDateTime =
    BookingEndDateAndTime && formatDateTimeForUser(BookingEndDateAndTime);

  const priceDetails = [
    {
      title: "Vehicle Rental Cost",
      name: "bookingPrice",
      price:
        vehiclePlanData != null
          ? Number(vehiclePlanData?.planPrice)
          : Number(perDayCost) *
            Number(
              getDurationInDays(
                bookingStartDateTime?.date,
                bookingEndDateTime?.date
              )
            ),
    },
    {
      title: "Extra Helmet Price(GST Applied)",
      name: "extraAddonPrice",
      price:
        50 +
        Number(
          calculateTax(
            50 *
              Number(
                getDurationInDays(
                  bookingStartDateTime?.date,
                  bookingEndDateTime?.date
                )
              ),
            18
          )
        ),
    },
    {
      title: "GST(18% Applied)",
      name: "tax",
      price: Number(
        calculateTax(
          vehiclePlanData != null
            ? Number(vehiclePlanData?.planPrice)
            : Number(perDayCost) *
                Number(
                  getDurationInDays(
                    bookingStartDateTime?.date,
                    bookingEndDateTime?.date
                  )
                ),
          18
        )
      ),
    },
  ];

  const [totalPrice, setTotalPrice] = useState(0);
  const [isExtraChecked, setIsExtraChecked] = useState(false);

  useEffect(() => {
    (() => {
      const totalPrice = priceDetails.reduce((total, item) => {
        if (item?.title.includes("Helmet") & !isExtraChecked) {
          return total; // Do not add the extra helmet price
        }
        return total + item.price;
      }, 0);
      setTotalPrice(totalPrice.toFixed(2));
    })();
  }, [isExtraChecked]);

  return (
    <>
      <div className="mt-6 mb-14 lg:mb-1">
        <ul className="leading-10 pb-3 border-b-2 border-gray-300">
          {priceDetails.map((item, index) => (
            <li
              className={`${
                item?.title.includes("Helmet") & !isExtraChecked ? "hidden" : ""
              } flex items-center justify-between`}
              key={index}
            >
              <input
                type="hidden"
                name={item?.name}
                value={
                  item?.title?.includes("Helmet")
                    ? isExtraChecked
                      ? item?.price
                      : ""
                    : item?.price
                }
              />
              <span className="text-gray-500">{item?.title}</span>{" "}
              <span className="font-semibold">₹{item?.price}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between py-2">
          <input type="hidden" name="totalPrice" value={totalPrice} />
          <span className="text-gray-500">Payable Amount</span>
          <span className="font-semibold">₹{totalPrice}</span>
        </div>
      </div>
      <div className="bg-yellow-200 -mx-4 px-4 pt-2 -mb-2 rounded-b-lg absolute bottom-2 w-full">
        <div className="mb-1">
          <label
            htmlFor="hr"
            className="flex flex-row items-center gap-2.5 font-semibold"
          >
            <input
              id="hr"
              type="checkbox"
              className="peer hidden"
              onChange={() => setIsExtraChecked(!isExtraChecked)}
            />
            <div
              htmlFor="hr"
              className="h-6 w-6 flex rounded-md border-2 border-gray-300 bg-lighter-gray peer-checked:bg-theme peer-checked:border-theme transition"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="w-5 h-5 stroke-gray-100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12.6111L8.92308 17.5L20 6.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            Need Extra Helmet
          </label>
        </div>
        <small className="italic text-gray-600">
          Extra cost <span className="font-bold">₹50/day</span> will apply for
          extra helmet
        </small>
      </div>
    </>
  );
};

export default PriceCard;
