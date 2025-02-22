import { createSlice } from "@reduxjs/toolkit";

const StationSlice = createSlice({
  name: "station",
  initialState: {
    station: [],
    selectedStation: null,
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
    addCurrentStation: (state, action) => {
      state.selectedStation = action.payload;
    },
  },
});

export const { fetchingStation, addStationData, addCurrentStation } =
  StationSlice.actions;

export default StationSlice.reducer;
