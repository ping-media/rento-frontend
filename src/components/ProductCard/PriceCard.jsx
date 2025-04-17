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
  const {
    tempCouponDiscount,
    tempCouponDiscountTotal,
    tempCouponName,
    isDiscountZero,
  } = useSelector((state) => state.coupon);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const taxPercentage = 18;
  const extraHelmetPrice = 50;

  // setting vehicleRentCost, extraAddOnCost & GstCost based on vehiclePlan is present or not
  useEffect(() => {
    let currentPlan = null;
    if (vehiclePlan !== null && vehiclePlan?.length > 0) {
      currentPlan = vehiclePlan?.find(
        (subItem) => subItem?._id === queryParmsData?.vehiclePlan || null
      );
      setAppliedVehiclePlan(currentPlan);
    }

    if (currentPlan !== null && currentPlan?.planPrice) {
      setVehicleRentCost(Number(currentPlan?.planPrice));
      setExtraAddOnCost(
        extraHelmetPrice *
          Number(
            getDurationInDays(
              bookingStartDateTime?.date,
              bookingEndDateTime?.date
            )
          )
      );

      if (isExtraChecked && extraAddOnCost) {
        setGSTCost(
          calculateTax(
            Number(
              currentPlan !== null && currentPlan?.planPrice > 0
                ? currentPlan?.planPrice
                : vehiclePlanData?.planPrice
            ) + parseInt(extraAddOnCost > 200 ? 200 : extraAddOnCost),
            taxPercentage
          )
        );
      } else {
        setGSTCost(
          calculateTax(
            Number(
              currentPlan !== null && currentPlan?.planPrice > 0
                ? currentPlan?.planPrice
                : vehiclePlanData?.planPrice
            ),
            taxPercentage
          )
        );
      }
    } else if (vehiclePlanData !== null) {
      if (perDayCost) {
        setVehicleRentCost(Number(vehiclePlanData?.planPrice));
      }
      setExtraAddOnCost(
        extraHelmetPrice *
          Number(
            getDurationInDays(
              bookingStartDateTime?.date,
              bookingEndDateTime?.date
            )
          )
      );
      //setting gst price if helemet is selected or not
      if (isExtraChecked && extraAddOnCost) {
        setGSTCost(
          calculateTax(
            Number(
              vehiclePlanData !== null && vehiclePlanData?.planPrice > 0
                ? vehiclePlanData?.planPrice
                : currentPlan?.planPrice
            ) + parseInt(extraAddOnCost > 200 ? 200 : extraAddOnCost),
            taxPercentage
          )
        );
      } else {
        setGSTCost(
          calculateTax(
            Number(
              currentPlan !== null && currentPlan?.planPrice > 0
                ? currentPlan?.planPrice
                : vehiclePlanData?.planPrice
            ),
            taxPercentage
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
        extraHelmetPrice *
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
                parseInt(extraAddOnCost > 200 ? 200 : extraAddOnCost),
              taxPercentage
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
              taxPercentage
            )
          )
        );
      }
    }
  }, [isExtraChecked]);

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
          if (item?.title?.includes("Helmet") && isExtraChecked === false) {
            return total;
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
                    {item?.name == "bookingPrice" && appliedVehiclePlan !== null
                      ? "Package Applied"
                      : ` ₹${
                          item?.name == "extraAddonPrice"
                            ? extraHelmetPrice
                            : perDayCost
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
      <div
        className={`bg-yellow-200 px-4 -mt-4 pt-1 ${
          isExtraChecked || currentUser !== null ? "" : "lg:-mb-2"
        } rounded-b-lg w-full`}
      >
        <div className="pb-1">
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
          Extra cost <span className="font-bold">₹{extraHelmetPrice}/day</span>{" "}
          will apply for extra helmet
        </small>
      </div>
    </>
  );
};

export default PriceCard;
