import { createSlice } from "@reduxjs/toolkit";

const ProductsSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchingVehicles: (state) => {
      state.vehicles = [];
      state.loading = true;
      state.error = null;
    },
    addVehiclesData: (state, action) => {
      state.vehicles = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchingVehicles, addVehiclesData } = ProductsSlice.actions;

export default ProductsSlice.reducer;
