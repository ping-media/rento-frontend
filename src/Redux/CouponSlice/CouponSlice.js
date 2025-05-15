import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tempTotalPrice: "",
  tempCouponName: "",
  tempCouponId: "",
  tempCouponDiscountTotal: "",
  tempCouponDiscount: "",
  isDiscountZero: false,
  tempCouponExtra: false,
  loading: false,
};

const CouponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    handleStartLoading: (state) => {
      state.loading = true;
    },
    addTempTotalPrice: (state, action) => {
      state.tempTotalPrice = action.payload;
    },
    addTempCouponDetails: (state, action) => {
      const {
        couponName,
        discountType,
        discount,
        id,
        isDiscountZeroResponse,
        isExtra,
      } = action.payload;
      state.tempCouponName = couponName;
      state.tempCouponDiscount = discountType;
      state.tempCouponDiscountTotal = discount;
      state.isDiscountZero = isDiscountZeroResponse;
      state.tempCouponId = id;
      state.tempCouponExtra = isExtra;
    },
    updateDiscountTotal: (state, action) => {
      state.tempCouponDiscountTotal = action.payload;
    },
    removeTempTotalPrice: (state) => {
      state.tempTotalPrice = "";
    },
    handleEndLoading: (state) => {
      state.loading = false;
    },
    handleRestCouponWithPrice: (state) => {
      state.tempCouponName = "";
      state.tempCouponId = "";
      state.tempCouponDiscountTotal = "";
      state.tempCouponDiscount = "";
      state.isDiscountZero = false;
      state.tempCouponExtra = false;
    },
    handleRestCoupon: () => initialState,
  },
});

export const {
  handleStartLoading,
  addTempTotalPrice,
  addTempCouponDetails,
  updateDiscountTotal,
  handleRestCouponWithPrice,
  removeTempTotalPrice,
  handleEndLoading,
  handleRestCoupon,
} = CouponSlice.actions;

export default CouponSlice.reducer;
