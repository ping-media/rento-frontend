import { createSlice } from "@reduxjs/toolkit";

const StationSlice = createSlice({
  name: "station",
  initialState: {
    station: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchingStation: (state) => {
      state.loading = true;
    },
    addStationData: (state, action) => {
      state.station = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchingStation, addStationData } = StationSlice.actions;

export default StationSlice.reducer;
