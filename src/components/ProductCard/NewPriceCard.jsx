import React, { useEffect, useState } from "react";
import {
  calculateTax,
  calculateTotalAddOnPriceAndTax,
  formatPrice,
  getDurationInDays,
} from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { addTempTotalPrice } from "../../Redux/CouponSlice/CouponSlice";
import { handleChangeExtraChecked } from "../../Redux/ProductSlice/ProductsSlice";
import { handleSelectedAddOn } from "../../Redux/AddOnSlice/AddOnSlice";
import Tooltip from "../Tooltip/Tooltip";
import { renderTooltipBreakdown } from "../../utils/helper";

const NewPriceCard = ({
  data,
  appliedPlans,
  refundableDeposit,
  totalRentalCost,
  daysBreakDown,
  vehiclePlanData,
  queryParmsData,
  bookingStartDateTime,
  bookingEndDateTime,
  gSTAddonCost,
  setGSTAddonCost,
  gSTCost,
  setGSTCost,
}) => {
  const { selectedAddOn } = useSelector((state) => state.addon);

  const [totalPrice, setTotalPrice] = useState(0);
  const [isExtraChecked, setIsExtraChecked] = useState([]);
  const [vehicleRentCost, setVehicleRentCost] = useState(
    Number(totalRentalCost),
  );
  const [extraAddOnCost, setExtraAddOnCost] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const {
    tempCouponDiscount,
    tempCouponDiscountTotal,
    tempCouponName,
    isDiscountZero,
  } = useSelector((state) => state.coupon);
  const dispatch = useDispatch();

  const duration = getDurationInDays(
    queryParmsData?.BookingStartDateAndTime,
    queryParmsData?.BookingEndDateAndTime,
  );

  const vehicleCategory = data?.vehicleMasterData?.vehicleCategory;
  const addon =
    data?.stationData?.extraAddOn?.filter((f) => f.status !== "inactive") || [];

  const taxPercentage =
    data?.stationData?.isGstActive === "active"
      ? Number(data?.vehicleMasterData?.gstPercentage)
      : 0;

  if (
    data?.stationData?.isGstActive === "active" &&
    taxPercentage === 0 &&
    daysBreakDown?.length === 0
  ) {
    return null;
  }

  // setting vehicleRentCost, extraAddOnCost & GstCost based on vehiclePlan is present or not
  useEffect(() => {
    let currentPlan = null;

    if (currentPlan !== null && currentPlan?.planPrice) {
      setVehicleRentCost(Number(currentPlan?.planPrice));
      const { total: AddOnTotal, tax: AddOnTax } =
        isExtraChecked?.length > 0
          ? calculateTotalAddOnPriceAndTax(isExtraChecked, duration)
          : { total: 0, tax: 0 };
      setExtraAddOnCost(AddOnTotal);
      setGSTAddonCost(AddOnTax);
    } else if (vehiclePlanData !== null) {
      const { total: AddOnTotal, tax: AddOnTax } =
        isExtraChecked?.length > 0
          ? calculateTotalAddOnPriceAndTax(isExtraChecked, duration)
          : { total: 0, tax: 0 };
      setExtraAddOnCost(AddOnTotal);
      setGSTAddonCost(AddOnTax);
    } else {
      const duration = getDurationInDays(
        bookingStartDateTime?.date,
        bookingEndDateTime?.date,
      );
      const { total: AddOnTotal, tax: AddOnTax } =
        isExtraChecked?.length > 0
          ? calculateTotalAddOnPriceAndTax(isExtraChecked, duration)
          : { total: 0, tax: 0 };
      setExtraAddOnCost(AddOnTotal);
      setGSTAddonCost(AddOnTax);
    }
  }, [isExtraChecked]);

  useEffect(() => {
    if (selectedAddOn?.length > 0) {
      setIsExtraChecked(selectedAddOn);
    }
  }, []);

  // adding this for coupon discount
  useEffect(() => {
    if (vehicleRentCost > 0) {
      dispatch(addTempTotalPrice(vehicleRentCost));
    }
  }, [vehicleRentCost]);

  // for calculating total price based on addons
  useEffect(() => {
    let subTotal = 0;
    let gst = 0;
    let totalPrice = 0;

    subTotal = Number(vehicleRentCost) + Number(extraAddOnCost);

    if (data?.stationData?.isGstActive === "active") {
      gst =
        Number(data?.tax) ||
        calculateTax(Number(vehicleRentCost), taxPercentage);
      totalPrice = Number(subTotal) + Number(gst) + Number(gSTAddonCost);
      setGSTCost(isNaN(gst) ? 0 : Math.round(gst));
    } else {
      totalPrice = Number(subTotal);
      setGSTCost(0);
    }

    if (tempCouponName !== "") {
      subTotal = Number(tempCouponDiscountTotal);
      if (isDiscountZero) {
        setDiscountedTotal(Number(subTotal));
        return;
      }

      if (Number(tempCouponDiscountTotal) > 0) {
        let disountPrice = Number(tempCouponDiscountTotal);

        if (data?.stationData?.isGstActive === "active") {
          gst = calculateTax(disountPrice, taxPercentage);
          setGSTCost(isNaN(gst) ? 0 : Math.round(gst));
          setDiscountedTotal(
            disountPrice + Number(extraAddOnCost) + gst + gSTAddonCost,
          );
        } else {
          setDiscountedTotal(subTotal);
          setGSTCost(0);
        }
      }
    }
    // setSubTotal(subTotal);
    setTotalPrice(Math.round(isNaN(totalPrice) ? 0 : totalPrice));
  }, [isExtraChecked, vehicleRentCost, extraAddOnCost, tempCouponName]);

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
      const addOn = isExtraChecked?.filter((i) => i?._id !== item?._id);
      setIsExtraChecked(addOn);
      dispatch(handleSelectedAddOn(addOn));
      dispatch(handleChangeExtraChecked(false));
    }
  };

  return (
    <>
      <div className="px-4 mt-2">
        <ul
          className={`leading-7 md:leading-8 md:text-base pb-2 border-b-2 border-gray-300`}
        >
          {/* vehicle Rental Price  */}
          <li className={`flex items-center justify-between`}>
            <input type="hidden" name="bookingPrice" value={vehicleRentCost} />
            <input
              type="hidden"
              name="extraAddonPrice"
              value={extraAddOnCost}
            />
            <div className="flex items-center gap-1">
              <p className="text-gray-500 ">Vehicle Rental Cost</p>
              <div className="text-xs text-gray-400">
                <Tooltip
                  buttonMessage={"(?)"}
                  className="font-bold text-gray-500"
                  tooltipData={renderTooltipBreakdown(
                    appliedPlans,
                    daysBreakDown,
                  )}
                />
              </div>
            </div>
            <span className="font-semibold">
              ₹{formatPrice(vehicleRentCost)}
            </span>
          </li>

          {tempCouponDiscount && tempCouponDiscount != null && (
            <li className="flex items-center justify-between mb-1">
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
            </li>
          )}

          {/* tax Price  */}
          {data?.stationData?.isGstActive === "active" && (
            <li className={`flex items-center justify-between`}>
              <input type="hidden" name="tax" value={gSTCost} />
              <div>
                <p className="text-gray-500 ">GST({taxPercentage}%)</p>
              </div>
              <span className="font-semibold">₹{formatPrice(gSTCost)}</span>
            </li>
          )}

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

          {/* addon tax price  */}
          {gSTAddonCost > 0 && (
            <li className={`flex items-center justify-between`}>
              <input type="hidden" name="addonTax" value={gSTAddonCost} />
              <div>
                <p className="text-gray-500 ">
                  GST({addon[0]?.gstPercentage}%)
                </p>
              </div>
              <span className="font-semibold">
                ₹{formatPrice(gSTAddonCost)}
              </span>
            </li>
          )}
        </ul>
        {/* total price & discount Price */}
        <div className="pt-2 md:text-base pb-2">
          <div className="flex items-center justify-between">
            <input type="hidden" name="totalPrice" value={totalPrice} />
            <input
              type="hidden"
              name="discounttotalPrice"
              value={Math.round(tempCouponDiscountTotal)}
            />
            <span className="font-extrabold">Payable Amount</span>
            <span className="font-extrabold">
              ₹
              {tempCouponDiscountTotal != null &&
              (isDiscountZero === true || tempCouponDiscountTotal > 0)
                ? formatPrice(Math.round(discountedTotal))
                : formatPrice(totalPrice)}
            </span>
          </div>
        </div>
        {/* refundableDeposit  */}
        <div className="flex items-center md:text-base border-t-2 border-gray-300 justify-between pb-2">
          <div>
            <span className="text-gray-500 mr-1">Refundable Deposit:</span>
            <span className="font-semibold">
              ₹{formatPrice(Math.round(refundableDeposit))}
            </span>
            <p className="text-xs text-theme font-bold">
              (An additional security deposit is payable at pickup)
            </p>
          </div>
        </div>
      </div>
      {/* extra accessories  */}
      {vehicleCategory !== "four-wheeler" && addon?.length > 0 && (
        <div className="bg-gradient-to-t from-yellow-200 to-yellow-300 px-4 md:text-base pt-1 rounded-b-lg w-full h-fit">
          {addon?.length > 0 &&
            addon?.map((item, index) => (
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
                  will be charged.
                </small>
              </React.Fragment>
            ))}
        </div>
      )}
    </>
  );
};

export default NewPriceCard;
