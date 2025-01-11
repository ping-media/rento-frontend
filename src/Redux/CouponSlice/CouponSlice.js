import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tempTotalPrice: "",
  tempCouponName: "",
  tempCouponId: "",
  tempCouponDiscountTotal: "",
  tempCouponDiscount: "",
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
      const { couponName, discountType, discount, id, isExtra } =
        action.payload;
      state.tempCouponName = couponName;
      state.tempCouponDiscount = discount;
      state.tempCouponDiscountTotal = discountType;
      state.tempCouponId = id;
      state.tempCouponExtra = isExtra;
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
      state.tempCouponExtra = false;
    },
    handleRestCoupon: () => initialState,
  },
});

export const {
  handleStartLoading,
  addTempTotalPrice,
  addTempCouponDetails,
  handleRestCouponWithPrice,
  removeTempTotalPrice,
  handleEndLoading,
  handleRestCoupon,
} = CouponSlice.actions;

export default CouponSlice.reducer;
