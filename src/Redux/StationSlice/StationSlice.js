import { createSlice } from "@reduxjs/toolkit";

const StationSlice = createSlice({
  name: "station",
  initialState: {
    station: [],
    stationLoading: false,
    error: null,
  },
  reducers: {
    fetchingStation: (state) => {
      state.stationLoading = true;
    },
    addStationData: (state, action) => {
      state.station = action.payload;
      state.stationLoading = false;
    },
  },
});

export const { fetchingStation, addStationData } = StationSlice.actions;

export default StationSlice.reducer;
