import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tempTotalPrice: "",
  tempCouponName: "",
  tempCouponId: "",
  tempCouponDiscount: "",
  tempCouponTotalAmount: "",
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
      const { couponName, totalPrice, discountPrice, id } = action.payload;
      state.tempCouponName = couponName;
      state.tempCouponDiscount = discountPrice;
      state.tempCouponTotalAmount = totalPrice;
      state.tempCouponId = id;
    },
    removeTempTotalPrice: (state) => {
      state.tempTotalPrice = "";
    },
    handleEndLoading: (state) => {
      state.loading = false;
    },
    handleRestCoupon: () => initialState,
  },
});

export const {
  handleStartLoading,
  addTempTotalPrice,
  addTempCouponDetails,
  removeTempTotalPrice,
  handleEndLoading,
  handleRestCoupon,
} = CouponSlice.actions;

export default CouponSlice.reducer;
