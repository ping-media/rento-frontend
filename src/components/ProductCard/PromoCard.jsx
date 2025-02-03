import { useEffect, useState } from "react";
import { handleAsyncError } from "../../utils/handleAsyncError";
import { useDispatch, useSelector } from "react-redux";
import { getCouponData } from "../../Data";
import {
  addTempCouponDetails,
  handleRestCouponWithPrice,
} from "../../Redux/CouponSlice/CouponSlice";
import PreLoader from "../skeleton/PreLoader";
// import { useSearchParams } from "react-router-dom";

const PromoCard = () => {
  const [CouponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const { tempTotalPrice, tempCouponName, tempCouponId } = useSelector(
    (state) => state.coupon
  );
  // const [queryParms] = useSearchParams();
  // const [isPackageApplied, setIsPackageApplied] = useState(false);
  const { isExtraAddonChecked } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();

  // setting the couponName in input if present
  useEffect(() => {
    if (tempCouponName) {
      return setCouponCode(tempCouponName);
    }
  }, [tempCouponName]);

  // useEffect(() => {
  //   const packageId = queryParms.get("vehiclePlan");
  //   if (packageId && packageId?.length > 0) {
  //     setIsPackageApplied(true);
  //   }
  // }, []);

  // updating the coupon with price
  useEffect(() => {
    if (tempCouponId && tempCouponId != "" && CouponCode && CouponCode != "") {
      handleApplyCoupon();
    }
  }, [tempTotalPrice]);

  // apply CouponCode
  const handleApplyCoupon = async () => {
    if (!CouponCode)
      return handleAsyncError(dispatch, "Enter valid coupon code");
    if (!tempTotalPrice)
      return handleAsyncError(dispatch, "uable to apply coupon!");
    // avoid applying coupon when user is using package
    // if (isPackageApplied === true) return;
    setLoading(true);
    try {
      const response = await getCouponData(
        CouponCode,
        tempTotalPrice,
        isExtraAddonChecked
      );
      if (response?.status == 200) {
        !isCouponApplied &&
          handleAsyncError(dispatch, "Coupon Applied.", "success");
        setIsCouponApplied(true);
        dispatch(
          addTempCouponDetails({
            couponName: CouponCode,
            discountType: Number(response?.data?.discount),
            discount: Number(response?.data?.finalAmount),
            isDiscountZeroResponse: response?.data?.isDiscountZero,
            id: response?.data?.coupon?._id,
            isExtra: response?.data?.isExtra,
          })
        );
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  // remove CouponCode
  const handleReomveCoupon = async () => {
    setCouponCode("");
    setIsCouponApplied(false);
    return dispatch(handleRestCouponWithPrice());
  };

  return (
    <>
      {/* show preloader until coupon is applied  */}
      {loading && <PreLoader />}
      <div className="border-2 border-gray-300 rounded-lg bg-white shadow-md border-t-0 order-1 mb-2 lg:mb-0 w-full">
        <div className="bg-theme rounded-t-lg mb-3">
          <h3 className="px-4 py-2 font-semibold text-gray-100">Promo Codes</h3>
        </div>
        {/* {isPackageApplied && (
          <p className="px-4 mb-1 text-xs italic text-gray-400">
            (Can't use coupon when package is applied)
          </p>
        )} */}
        <div className="w-full h-10 relative flex items-center px-4 mb-3">
          <input
            className="w-full h-full bg-white font-light placeholder-slate-400 contrast-more:placeholder-slate-500 border-2 border-slate-200 outline-none rounded-lg focus:border-theme focus:ring-theme focus:ring-1 px-3 uppercase disabled:bg-gray-300 disabled:bg-opacity-50"
            placeholder="Enter Promo Coupon Here"
            value={CouponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            type="text"
            // disabled={isPackageApplied}
            readOnly={tempCouponId != ""}
          />
          <div className="w-10 absolute block right-8 fill-theme">
            {tempCouponId === "" ? (
              <button
                className={`text-theme disabled:text-gray-500`}
                type="button"
                disabled={
                  // isPackageApplied ||
                  tempCouponId != "" || CouponCode.length < 6
                }
                onClick={handleApplyCoupon}
              >
                apply
              </button>
            ) : (
              <button
                className={`text-theme`}
                type="button"
                onClick={handleReomveCoupon}
              >
                remove
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoCard;
