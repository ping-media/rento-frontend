import React, { useEffect, useState } from "react";
import {
  calculateTax,
  calculateTotalAddOnPrice,
  formatDateTimeForUser,
  formatPrice,
  getDurationInDays,
} from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { addTempTotalPrice } from "../../Redux/CouponSlice/CouponSlice";
import { handleChangeExtraChecked } from "../../Redux/ProductSlice/ProductsSlice";
import PreLoader from "../skeleton/PreLoader";
import { handleSelectedAddOn } from "../../Redux/AddOnSlice/AddOnSlice";

const PriceCard = ({
  perDayCost,
  vehiclePlan,
  vehiclePlanData,
  queryParmsData,
}) => {
  const { addon, selectedAddOn, loading } = useSelector((state) => state.addon);
  const bookingStartDateTime =
    queryParmsData?.BookingStartDateAndTime &&
    formatDateTimeForUser(queryParmsData?.BookingStartDateAndTime);
  const bookingEndDateTime =
    queryParmsData?.BookingEndDateAndTime &&
    formatDateTimeForUser(queryParmsData?.BookingEndDateAndTime);

  const [totalPrice, setTotalPrice] = useState(0);
  const [isExtraChecked, setIsExtraChecked] = useState([]);
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
  const dispatch = useDispatch();
  const taxPercentage = 18;
  const duration = getDurationInDays(
    queryParmsData?.BookingStartDateAndTime,
    queryParmsData?.BookingEndDateAndTime
  );

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
      const AddOnAmount =
        isExtraChecked?.length > 0
          ? calculateTotalAddOnPrice(isExtraChecked, duration)
          : 0;
      setExtraAddOnCost(AddOnAmount);

      if (isExtraChecked?.length > 0) {
        setGSTCost(
          calculateTax(
            Number(
              currentPlan !== null && currentPlan?.planPrice > 0
                ? currentPlan?.planPrice
                : vehiclePlanData?.planPrice
            ) + Math.round(AddOnAmount),
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
      //setting gst price if helemet is selected or not
      const AddOnAmount =
        isExtraChecked?.length > 0
          ? calculateTotalAddOnPrice(isExtraChecked, duration)
          : 0;
      setExtraAddOnCost(AddOnAmount);
      if (isExtraChecked?.length > 0) {
        setGSTCost(
          calculateTax(
            Number(
              vehiclePlanData !== null && vehiclePlanData?.planPrice > 0
                ? vehiclePlanData?.planPrice
                : currentPlan?.planPrice
            ) + Math.round(AddOnAmount),
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
      const AddOnAmount =
        isExtraChecked?.length > 0
          ? calculateTotalAddOnPrice(
              isExtraChecked,
              Number(
                getDurationInDays(
                  bookingStartDateTime?.date,
                  bookingEndDateTime?.date
                )
              )
            )
          : 0;
      setExtraAddOnCost(AddOnAmount);
      if (isExtraChecked?.length > 0) {
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
                Math.round(AddOnAmount),
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

  useEffect(() => {
    if (selectedAddOn?.length > 0) {
      setIsExtraChecked(selectedAddOn);
    }
  }, []);

  // for calculating total price based on addons
  useEffect(() => {
    const totalPrice =
      Number(vehicleRentCost) + Number(extraAddOnCost) + Number(gSTCost);
    setTotalPrice(Math.round(totalPrice));
    dispatch(addTempTotalPrice(Math.round(totalPrice)));
  }, [isExtraChecked, vehicleRentCost, extraAddOnCost, gSTCost]);

  // adding addon in booking
  const handleChangeExtraAddonPrice = (item) => {
    const exists =
      isExtraChecked?.length > 0
        ? isExtraChecked?.some((i) => i?._id === item?._id)
        : false;
    if (!exists) {
      const updated = [...(isExtraChecked || []), item];
      setIsExtraChecked(updated);
      dispatch(handleSelectedAddOn(updated));
      dispatch(handleChangeExtraChecked(true));
    } else {
      setIsExtraChecked(isExtraChecked?.filter((i) => i?._id !== item?._id));
      dispatch(
        handleSelectedAddOn(isExtraChecked?.filter((i) => i?._id !== item?._id))
      );
      dispatch(handleChangeExtraChecked(false));
    }
  };

  return !loading ? (
    <>
      <div className="px-4 mt-2">
        <ul className="leading-7 pb-3 border-b-2 border-gray-300">
          {/* vehicle Rental Price  */}
          <li className={`flex items-center justify-between`}>
            <input type="hidden" name="bookingPrice" value={vehicleRentCost} />
            <input
              type="hidden"
              name="extraAddonPrice"
              value={extraAddOnCost}
            />
            <div>
              <p className="text-gray-500 ">Vehicle Rental Cost</p>
              <p className="text-xs text-gray-400">
                {appliedVehiclePlan !== null
                  ? `(${duration} Package Applied)`
                  : ` ₹${perDayCost} x ${
                      vehiclePlanData != null
                        ? vehiclePlanData?.planDuration
                        : getDurationInDays(
                            queryParmsData?.BookingStartDateAndTime,
                            queryParmsData?.BookingEndDateAndTime
                          )
                    } day`}
              </p>
            </div>
            <span className="font-semibold">
              ₹{formatPrice(vehicleRentCost)}
            </span>
          </li>
          {/* extra Add on Data  */}
          {isExtraChecked?.length > 0 &&
            isExtraChecked?.map((item, index) => (
              <li className="flex items-center justify-between" key={index}>
                <div>
                  <p className="text-gray-500 capitalize">{item?.name}</p>
                  <p className="text-xs text-gray-400">
                    ({`₹${item?.amount} x ${duration} day`})
                  </p>
                </div>
                <span className="font-semibold">
                  ₹
                  {item?.maxAmount === 0
                    ? formatPrice(item?.amount * duration)
                    : item?.amount * duration > item?.maxAmount
                    ? formatPrice(item?.maxAmount)
                    : formatPrice(item?.amount * duration)}
                </span>
              </li>
            ))}
          {/* tax Price  */}
          <li className={`flex items-center justify-between`}>
            <input type="hidden" name="tax" value={gSTCost} />
            <div>
              <p className="text-gray-500 ">GST(18% Applied)</p>
            </div>
            <span className="font-semibold">₹{formatPrice(gSTCost)}</span>
          </li>
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
                -₹{formatPrice(Math.round(tempCouponDiscount))}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <input type="hidden" name="totalPrice" value={totalPrice} />
            <input
              type="hidden"
              name="discounttotalPrice"
              value={Math.round(tempCouponDiscountTotal)}
            />
            <span className="text-gray-500">Payable Amount</span>
            <span className="font-semibold">
              ₹
              {tempCouponDiscountTotal != null &&
              (isDiscountZero === true || tempCouponDiscountTotal > 0)
                ? formatPrice(Math.round(tempCouponDiscountTotal))
                : formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
      {/* extra accessories  */}
      <div className="bg-gradient-to-t from-yellow-200 to-yellow-300 px-4 pt-1 rounded-b-lg w-full">
        {addon?.length > 0 &&
          addon
            ?.filter((f) => f.status !== "inactive")
            ?.map((item, index) => (
              <React.Fragment key={index}>
                <div>
                  <label
                    htmlFor={item?.name}
                    className="flex flex-row items-center gap-2.5 font-semibold capitalize"
                  >
                    <input
                      id={item?.name}
                      type="checkbox"
                      className="h-5 w-5 accent-red-600 outline-none"
                      checked={isExtraChecked?.some((i) => i._id === item._id)}
                      onChange={() => handleChangeExtraAddonPrice(item)}
                    />
                    Need {item?.name}
                  </label>
                </div>
                <small className="text-gray-700">
                  An extra cost of{" "}
                  <span className="font-bold">
                    ₹{formatPrice(item?.amount)}/day
                  </span>{" "}
                  will apply for {item?.name}.
                </small>
              </React.Fragment>
            ))}
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default PriceCard;
