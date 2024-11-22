import { createSlice } from "@reduxjs/toolkit";

const LocationSlice = createSlice({
  name: "selectedLocation",
  initialState: {
    selectedLocation: {},
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
    resetLocation: (state) => {
      state.selectedLocation = {};
      state.loading = false;
      state.error = null;
    },
  },
});

export const { addingLocation, addLocation, resetLocation } =
  LocationSlice.actions;

export default LocationSlice.reducer;
