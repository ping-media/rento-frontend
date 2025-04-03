import { createSlice } from "@reduxjs/toolkit";

const LocationSlice = createSlice({
  name: "selectedLocation",
  initialState: {
    selectedLocation: null,
    isLocationChange: false,
    loading: false,
    error: null,
  },
  reducers: {
    addingLocation: (state) => {
      state.loading = true;
    },
    addLocation: (state, action) => {
      state.selectedLocation = action.payload;
      state.loading = false;
    },
    handleCheckLocationChange: (state) => {
      state.isLocationChange = !state.isLocationChange;
    },
    resetLocation: (state) => {
      state.selectedLocation = {};
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  addingLocation,
  addLocation,
  handleCheckLocationChange,
  resetLocation,
} = LocationSlice.actions;

export default LocationSlice.reducer;
