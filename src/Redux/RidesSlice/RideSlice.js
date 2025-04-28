import { createSlice } from "@reduxjs/toolkit";

const RideSlice = createSlice({
  name: "rides",
  initialState: {
    rides: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchingRides: (state) => {
      state.rides = [];
      state.loading = true;
      state.error = null;
    },
    addRidesData: (state, action) => {
      state.rides = action.payload;
      state.loading = false;
    },
    updateRidesData: (state, action) => {
      if (state.rides.length > 0) {
        state.rides[0] = { ...state.rides[0], ...action.payload };
      }
    },
    removeRidesData: (state) => {
      state.rides = [];
    },
  },
});

export const { fetchingRides, addRidesData, updateRidesData, removeRidesData } =
  RideSlice.actions;

export default RideSlice.reducer;
