import { createSlice } from "@reduxjs/toolkit";

const ProductsSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    tempDate: "",
    loading: false,
    error: null,
  },
  reducers: {
    handleStartLoading: (state) => {
      state.loading = true;
    },
    addTempDate: (state, action) => {
      state.tempDate = action.payload;
      state.loading = false;
    },
    removeTempDate: (state) => {
      state.tempDate = "";
    },
    fetchingVehicles: (state) => {
      state.vehicles = [];
      state.loading = true;
      state.error = null;
    },
    addVehiclesData: (state, action) => {
      state.vehicles = action.payload;
      state.loading = false;
    },
    handleEndLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  handleStartLoading,
  addTempDate,
  removeTempDate,
  fetchingVehicles,
  addVehiclesData,
  handleEndLoading,
} = ProductsSlice.actions;

export default ProductsSlice.reducer;
