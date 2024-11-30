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
  },
});

export const { fetchingRides, addRidesData } = RideSlice.actions;

export default RideSlice.reducer;
