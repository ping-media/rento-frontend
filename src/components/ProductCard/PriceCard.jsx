import { useEffect, useState } from "react";
import {
  calculateTax,
  formatDateTimeForUser,
  formatPrice,
  getDurationInDays,
} from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { addTempTotalPrice } from "../../Redux/CouponSlice/CouponSlice";
import { handleChangeExtraChecked } from "../../Redux/ProductSlice/ProductsSlice";

const PriceCard = ({
  perDayCost,
  vehiclePlan,
  vehiclePlanData,
  queryParmsData,
}) => {
  const bookingStartDateTime =
    queryParmsData?.BookingStartDateAndTime &&
    formatDateTimeForUser(queryParmsData?.BookingStartDateAndTime);
  const bookingEndDateTime =
    queryParmsData?.BookingEndDateAndTime &&
    formatDateTimeForUser(queryParmsData?.BookingEndDateAndTime);

  const [totalPrice, setTotalPrice] = useState(0);
  const [isExtraChecked, setIsExtraChecked] = useState(false);
  const [vehicleRentCost, setVehicleRentCost] = useState(0);
  const [extraAddOnCost, setExtraAddOnCost] = useState(0);
  const [gSTCost, setGSTCost] = useState(0);
  const [appliedVehiclePlan, setAppliedVehiclePlan] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discounttotalPrice, setDiscounttotalPrice] = useState(0);
  const {
    tempCouponDiscount,
    tempCouponDiscountTotal,
    tempCouponName,
    isDiscountZero,
    loading,
  } = useSelector((state) => state.coupon);
  const dispatch = useDispatch();

  // for getting plan price
  useEffect(() => {
    if (vehiclePlan != null && vehiclePlan?.length > 0) {
      const plan = vehiclePlan?.find(
        (subItem) => subItem?._id === queryParmsData?.vehiclePlan || null
      );
      setAppliedVehiclePlan(plan);
    } else {
      setAppliedVehiclePlan(null);
    }
  }, []);

  // setting vehicleRentCost, extraAddOnCost & GstCost based on vehiclePlan is present or not
  useEffect(() => {
    if (appliedVehiclePlan != null && appliedVehiclePlan?.planPrice) {
      setVehicleRentCost(Number(appliedVehiclePlan?.planPrice));
    } else if (vehiclePlanData != null) {
      if (perDayCost) {
        setVehicleRentCost(Number(vehiclePlanData?.planPrice));
      }
      setExtraAddOnCost(50 * Number(vehiclePlanData?.planDuration));
      //setting gst price if helemet is selected or not
      if (isExtraChecked && extraAddOnCost) {
        setGSTCost(
          Number(
            calculateTax(
              Number(
                appliedVehiclePlan != null && appliedVehiclePlan?.planPrice > 0
                  ? appliedVehiclePlan?.planPrice
                  : vehiclePlanData?.planPrice
              ) + extraAddOnCost,
              18
            )
          )
        );
      } else {
        setGSTCost(
          Number(
            calculateTax(
              Number(
                appliedVehiclePlan != null && appliedVehiclePlan?.planPrice > 0
                  ? appliedVehiclePlan?.planPrice
                  : vehiclePlanData?.planPrice
              ),
              18
            )
          )
        );
      }
    } else {
      if (perDayCost) {
        setVehicleRentCost(
          Number(perDayCost) *
            Number(
              getDurationInDays(
                bookingStartDateTime?.date,
                bookingEndDateTime?.date
              )
            )
        );
      }
      setExtraAddOnCost(
        50 *
          Number(
            getDurationInDays(
              bookingStartDateTime?.date,
              bookingEndDateTime?.date
            )
          )
      );
      if (isExtraChecked && extraAddOnCost) {
        setGSTCost(
          Number(
            calculateTax(
              Number(perDayCost) *
                Number(
                  getDurationInDays(
                    bookingStartDateTime?.date,
                    bookingEndDateTime?.date
                  )
                ) +
                Number(extraAddOnCost),
              18
            )
          )
        );
      } else {
        setGSTCost(
          Number(
            calculateTax(
              Number(perDayCost) *
                Number(
                  getDurationInDays(
                    bookingStartDateTime?.date,
                    bookingEndDateTime?.date
                  )
                ),
              18
            )
          )
        );
      }
    }
  }, [isExtraChecked, appliedVehiclePlan]);

  // price list
  const priceDetails = [
    {
      title: "Vehicle Rental Cost",
      name: "bookingPrice",
      price: parseInt(vehicleRentCost),
    },
    {
      title: "Extra Helmet Price",
      name: "extraAddonPrice",
      // do this because we don't need to take helmet price more than 200
      price: parseInt(extraAddOnCost > 200 ? 200 : extraAddOnCost),
    },
    {
      title: "GST(18% Applied)",
      name: "tax",
      price: parseInt(gSTCost),
    },
  ];

  // for calculating price based on helmet add or not
  useEffect(() => {
    (() => {
      if (vehicleRentCost != 0 && extraAddOnCost != 0 && gSTCost != 0) {
        const totalPrice = priceDetails.reduce((total, item) => {
          if (item?.title.includes("Helmet") & !isExtraChecked) {
            return total; // Do not add the extra helmet price
          }
          return total + item.price;
        }, 0);
        setTotalPrice(totalPrice?.toFixed(2));
        dispatch(addTempTotalPrice(totalPrice?.toFixed(2)));
      }
    })();
  }, [isExtraChecked, vehicleRentCost, extraAddOnCost, gSTCost]);

  const handleChangeExtraAddonPrice = () => {
    setIsExtraChecked(!isExtraChecked);
    dispatch(handleChangeExtraChecked(!isExtraChecked));
  };

  // changing price based discount and addon
  useEffect(() => {
    if (!loading) {
      setDiscountPrice(Math.ceil(tempCouponDiscountTotal).toFixed(2));
      setDiscounttotalPrice(Math.ceil(tempCouponDiscount).toFixed(2));
    }
  }, [loading]);

  return (
    <>
      <div className="px-4 mt-6 mb-4 lg:mb-2">
        <ul className="leading-7 pb-3 border-b-2 border-gray-300">
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
              <div>
                <p className="text-gray-500 ">{item?.title}</p>
                {(item?.name == "bookingPrice" ||
                  item?.name == "extraAddonPrice") && (
                  <p className="text-xs text-gray-400">
                    (
                    {item?.name == "bookingPrice" && appliedVehiclePlan != null
                      ? "Package Applied"
                      : ` ₹${
                          item?.name == "extraAddonPrice" ? 50 : perDayCost
                        } x ${
                          vehiclePlanData != null
                            ? vehiclePlanData?.planDuration
                            : getDurationInDays(
                                queryParmsData?.BookingStartDateAndTime,
                                queryParmsData?.BookingEndDateAndTime
                              )
                        } day`}
                    )
                  </p>
                )}
              </div>
              <span className="font-semibold">₹{formatPrice(item?.price)}</span>
            </li>
          ))}
        </ul>
        {/* total price  & discount Price */}
        <div className={`${isExtraChecked ? "pt-2 pb-6" : "pt-2 pb-6"}`}>
          {tempCouponDiscount && tempCouponDiscount != null && (
            <div className="flex items-center justify-between mb-1">
              <input
                type="hidden"
                name="discountPrice"
                value={tempCouponDiscount}
              />
              <div>
                <span className="text-gray-500">Discount Amount</span>
                <span className="block text-xs text-gray-400">
                  coupon: ({tempCouponName})
                </span>
              </div>
              <span className="font-semibold">
                -₹{formatPrice(tempCouponDiscount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <input type="hidden" name="totalPrice" value={totalPrice} />
            <input
              type="hidden"
              name="discounttotalPrice"
              value={tempCouponDiscountTotal}
            />
            <span className="text-gray-500">Payable Amount</span>
            <span className="font-semibold">
              ₹
              {tempCouponDiscountTotal != null &&
              (isDiscountZero === true || tempCouponDiscountTotal > 0)
                ? formatPrice(tempCouponDiscountTotal)
                : formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
      {/* extra helmet  */}
      <div className="bg-yellow-200 px-4 -mt-4 pt-1 -mb-2 rounded-b-lg bottom-2 w-full">
        <div className="mb-1">
          <label
            htmlFor="hr"
            className="flex flex-row items-center gap-2.5 font-semibold"
          >
            <input
              id="hr"
              type="checkbox"
              className="peer hidden"
              onChange={handleChangeExtraAddonPrice}
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
