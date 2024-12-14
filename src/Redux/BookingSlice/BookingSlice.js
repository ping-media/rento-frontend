import { createSlice } from "@reduxjs/toolkit";

const BookingSlice = createSlice({
  name: "booking",
  initialState: {
    tempBookingData: null,
    isBookingDetailsActive: false,
    loading: false,
  },
  reducers: {
    handleStartLoading: (state) => {
      state.loading = true;
    },
    addTempBookingData: (state, action) => {
      state.tempBookingData = action.payload;
      state.isBookingDetailsActive = true;
    },
    removeTempBookingData: (state) => {
      state.tempBookingData = null;
      state.isBookingDetailsActive = false;
    },
    handleEndLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  handleStartLoading,
  addTempBookingData,
  removeTempBookingData,
  handleEndLoading,
} = BookingSlice.actions;

export default BookingSlice.reducer;
